const express = require('express')
const cors = require('cors')
const app = express()

require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const port = process.env.PORT || 3000

const crypto = require("crypto");
const { access } = require('fs');

function generateTrackingId() {
    const prefix = "ZAP"; // Zap-Shift
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars

    return `${prefix}-${date}-${random}`;
}

// Don't export here - we'll export the app at the end

// Firebase SDK
const admin = require("firebase-admin");

const serviceAccount = require("./zap-shift-firebase-adminsdk.json");
const e = require('express');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



// Middleware
app.use(express.json());
app.use(cors());

const VerifyFirebaseToken = async (req, res, next) => {
    // console.log('headers in middle ware', req.headers?.authorization)
    const Token = req.headers.authorization;

    if (!Token) {
        return res.status(401).send({ message: 'Unauthorized access' })
    }
    try {
        const tokenId = Token.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(tokenId);
        console.log('Decoded in the token', decoded);
        req.decoded_email = decoded.email;

        next()
    }
    catch (err) {
        return res.status(401).send({ message: "Unauthorized access" });
    }
}

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.mcccn4v.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db('zap_shift_db');
        const parcelCollection = db.collection('parcels');
        const paymentCollection = db.collection('payments');
        const usersCollection = db.collection('users');
        const ridersCollection = db.collection('riders');

        // middleWare with database access >> admin before allowing admin activity
        // Must be used after VerifyFirebaseToken middleWare

        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded_email;
            const query = { email };
            const user = await usersCollection.findOne(query);

            if (!user || user.role !== 'admin') {
                res.send({ message: "Forbidden access" })
            }

            next()
        }

        // User Related Api

        // app.get('/users', async (req, res) => {
        //     const searchText = req.query.searchText;
        //     const query = {};

        //     if (searchText) {
        //         // // use regex for finding name when search and use option for ignore cases (UpperCase/LowerCase) >>> use $or for search email or name
        //         query.$or = [
        //             { displayName: { $regex: searchText, $options: 'i' } },
        //             { email: { $regex: searchText, $options: 'i' } }
        //         ]
        //     }

        //     const cursor = usersCollection.find(query).sort({ createdAt: -1 }).limit(10);
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        app.get('/users', async (req, res) => {
            const searchText = req.query.searchText || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const query = {};

            if (searchText) {
                query.$or = [
                    { displayName: { $regex: searchText, $options: 'i' } },
                    { email: { $regex: searchText, $options: 'i' } }
                ];
            }

            const totalUsers = await usersCollection.countDocuments(query);
            const result = await usersCollection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();

            res.send({ result, totalUsers });
        });


        app.get('/users/:id', async (req, res) => {

        })

        app.get('/users/:email/role', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ role: user?.role || 'user' })
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            user.role = 'user';
            user.createdAt = new Date();
            const email = user.email;
            const userExist = await usersCollection.findOne({ email })
            if (userExist) {
                return res.send({ message: "User exist" });
            }

            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.patch('/users/:id/role', VerifyFirebaseToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const roleInfo = req.body;
            const query = { _id: new ObjectId(id) };
            const updateDocs = {
                $set: {
                    role: roleInfo.role
                }
            }
            const result = await usersCollection.updateOne(query, updateDocs);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })


        // Parcel API
        app.get('/parcels', async (req, res) => {
            const query = {}
            const { email, deliveryStatus } = req.query;
            // parcels?email''&
            if (email) {
                query.senderEmail = email;
            }
            if (deliveryStatus) {
                query.deliveryStatus = deliveryStatus;
            }

            const options = { sort: { createdAt: -1 } }

            const cursor = parcelCollection.find(query, options)
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/parcels/rider', async (req, res) => {
            const { riderEmail, deliveryStatus } = req.query;
            // console.log(riderEmail, deliveryStatus)
            const query = {};
            if (riderEmail) {
                query.riderEmail = riderEmail;
            }
            if (deliveryStatus) {
                query.deliveryStatus = deliveryStatus;
            }
            // console.log(query)

            // const cursor = parcelCollection.find(query);
            // const result = await cursor.toArray();
            const result = await parcelCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/parcels/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await parcelCollection.findOne(query);
            res.send(result);
        })

        app.post('/parcels', async (req, res) => {
            const parcel = req.body;
            // Parcel Created Time 
            parcel.createdAt = new Date();
            const result = await parcelCollection.insertOne(parcel);
            res.send(result);
        });

        app.patch('/parcels/:id', async (req, res) => {
            const { riderId, riderName, riderEmail, riderPhone } = req.body;
            const id = req.params;
            const query = { _id: new ObjectId(id) };
            const updatedDocs = {
                $set: {
                    riderId: riderId,
                    riderName: riderName,
                    riderEmail: riderEmail,
                    riderPhone: riderPhone,
                    deliveryStatus: 'driver-assigned'
                }
            }
            const result = await parcelCollection.updateOne(query, updatedDocs);

            // Update rider information 

            const riderQuery = { _id: new ObjectId(riderId) };
            const riderUpdatedDocs = {
                $set: {
                    workStatus: 'in_delivery'
                }
            }
            const riderResult = await ridersCollection.updateOne(riderQuery, riderUpdatedDocs);
            res.send(riderResult)
        })

        app.delete('/parcels/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await parcelCollection.deleteOne(query);
            res.send(result);
        })

        // Payment Related API
        app.post('/create-checkout-session', async (req, res) => {
            const paymentInfo = req.body;
            const amount = parseInt(paymentInfo.cost) * 100;

            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'USD',
                            unit_amount: amount,
                            product_data: {
                                name: `Please pay for ${paymentInfo.parcelName}`
                            }
                        },
                        quantity: 1,
                    },
                ],
                customer_email: paymentInfo.senderEmail,
                mode: 'payment',
                metadata: {
                    parcelId: paymentInfo.parcelId,
                    parcelName: paymentInfo.parcelName,
                },
                success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
            })
            // console.log(session)
            res.send({ url: session.url });
        })

        app.patch('/payment-success', async (req, res) => {
            const sessionId = req.body.session_id;
            // console.log('Session is ', sessionId);

            const session = await stripe.checkout.sessions.retrieve(sessionId);
            // console.log('Session retrieve', session)

            // doing for not repeat double time the payment history >>> repeat for the use effect in client site we need to control from backend
            const transactionId = session.payment_intent; // take the transaction  id 
            const query = { transactionId: transactionId } // check the id on database

            const paymentExist = await paymentCollection.findOne(query);
            console.log(paymentExist);

            if (paymentExist) {
                return res.send({
                    message: "Already exist",
                    transactionId,
                    trackingId: paymentExist.trackingId
                })
            }

            const trackingId = generateTrackingId()

            if (session.payment_status === 'paid') {
                const id = session.metadata.parcelId;
                const query = { _id: new ObjectId(id) };
                const update = {
                    $set: {
                        paymentStatus: 'paid',
                        deliveryStatus: 'pending-pickup',
                        trackingId: trackingId
                    }
                }
                const result = await parcelCollection.updateOne(query, update);

                const payment = {
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    customer_email: session.customer_email,
                    parcelID: session.metadata.parcelID,
                    parcelName: session.metadata.parcelName,
                    transactionId: session.payment_intent,
                    paymentStatus: session.payment_status,
                    paidAt: new Date(),
                    trackingId: trackingId
                }

                if (session.payment_status === 'paid') {
                    const paymentResult = await paymentCollection.insertOne(payment)
                    res.send({
                        success: true,
                        modifyParcel: result,
                        trackingId: trackingId,
                        transactionId: session.payment_intent,
                        paymentInfo: paymentResult
                    })
                }
                // res.send(result);
            }
            res.send({ success: false })
        })

        app.get('/payments', VerifyFirebaseToken, async (req, res) => {
            const email = req.query.email;
            const query = {};
            // console.log('Header &&', req.headers)
            if (email) {
                query.customer_email = email;

                // Check email address

                if (email !== req.decoded_email) {
                    return res.status(403).send({ message: "Forbidden access" })
                }
            }
            const cursor = paymentCollection.find(query).sort({ paidAt: -1 });
            const result = await cursor.toArray();
            res.send(result)
        })

        app.delete('/payments', async (req, res) => {
            // const id = req.params.id;
            // const query = { _id: new ObjectId(id) };

            const result = await paymentCollection.deleteMany();
            res.send(result);
        })

        // Rider related API

        app.get('/riders', async (req, res) => {
            const { status, district, workStatus } = req.query;
            const query = {};
            if (status) {
                query.status = status
            }
            if (district) {
                query.District = district
            }
            if (workStatus) {
                query.workStatus = workStatus
            }
            const cursor = ridersCollection.find(query).sort({ createdAT: 1 });

            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/riders', async (req, res) => {
            const rider = req.body;
            rider.status = 'pending';
            rider.createdAT = new Date();

            const result = await ridersCollection.insertOne(rider);
            res.send(result);
        })

        app.patch('/riders/:id', VerifyFirebaseToken, async (req, res) => {
            const status = req.body.status;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDocs = {
                $set: {
                    status: status,
                    workStatus: 'available'
                }
            }
            const result = await ridersCollection.updateOne(query, updatedDocs);

            if (status === 'approved') {
                const email = req.body.email;
                const userQuery = { email };
                const updateUser = {
                    $set: {
                        role: 'rider'
                    }
                }
                const uerResult = await usersCollection.updateOne(userQuery, updateUser);
            }

            res.send(result);
        })

        app.delete('/riders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await ridersCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Zap is shifting now!')
})

// For local development
if (process.env.VERCEL !== '1') {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

// Export for Vercel serverless
module.exports = app;
