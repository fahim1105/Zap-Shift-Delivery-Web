const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const crypto = require("crypto");

function generateTrackingId() {
    const prefix = "ZAP";
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `${prefix}-${date}-${random}`;
}

// Firebase SDK
const admin = require("firebase-admin");
const serviceAccount = require("../zap-shift-firebase-adminsdk.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

// Middleware
app.use(express.json());
app.use(cors());

const VerifyFirebaseToken = async (req, res, next) => {
    const Token = req.headers.authorization;
    if (!Token) {
        return res.status(401).send({ message: 'Unauthorized access' });
    }
    try {
        const tokenId = Token.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(tokenId);
        req.decoded_email = decoded.email;
        next();
    } catch (err) {
        return res.status(401).send({ message: "Unauthorized access" });
    }
};

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.mcccn4v.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Global connection cache
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    
    await client.connect();
    const db = client.db('zap_shift_db');
    
    cachedDb = {
        parcelCollection: db.collection('parcels'),
        paymentCollection: db.collection('payments'),
        usersCollection: db.collection('users'),
        ridersCollection: db.collection('riders')
    };
    
    console.log("Connected to MongoDB!");
    return cachedDb;
}

// Middleware for admin verification
const verifyAdmin = async (req, res, next) => {
    const { usersCollection } = await connectToDatabase();
    const email = req.decoded_email;
    const query = { email };
    const user = await usersCollection.findOne(query);

    if (!user || user.role !== 'admin') {
        return res.status(403).send({ message: "Forbidden access" });
    }
    next();
};

// ===== USER ROUTES =====
app.get('/users', async (req, res) => {
    try {
        const { usersCollection } = await connectToDatabase();
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
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/users/:email/role', async (req, res) => {
    try {
        const { usersCollection } = await connectToDatabase();
        const email = req.params.email;
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ role: user?.role || 'user' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        const { usersCollection } = await connectToDatabase();
        const user = req.body;
        user.role = 'user';
        user.createdAt = new Date();
        const email = user.email;
        const userExist = await usersCollection.findOne({ email });
        if (userExist) {
            return res.send({ message: "User exist" });
        }

        const result = await usersCollection.insertOne(user);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.patch('/users/:id/role', VerifyFirebaseToken, verifyAdmin, async (req, res) => {
    try {
        const { usersCollection } = await connectToDatabase();
        const id = req.params.id;
        const roleInfo = req.body;
        const query = { _id: new ObjectId(id) };
        const updateDocs = {
            $set: {
                role: roleInfo.role
            }
        };
        const result = await usersCollection.updateOne(query, updateDocs);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { usersCollection } = await connectToDatabase();
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.deleteOne(query);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ===== PARCEL ROUTES =====
app.get('/parcels', async (req, res) => {
    try {
        const { parcelCollection } = await connectToDatabase();
        const query = {};
        const { email, deliveryStatus, page, limit, sort } = req.query;
        
        if (email) {
            query.senderEmail = email;
        }
        if (deliveryStatus) {
            query.deliveryStatus = deliveryStatus;
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        }

        const result = await parcelCollection.find(query).sort(sortOption).skip(skip).limit(limitNum).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/parcels/rider', async (req, res) => {
    try {
        const { parcelCollection } = await connectToDatabase();
        const { riderEmail, deliveryStatus } = req.query;
        const query = {};
        if (riderEmail) {
            query.riderEmail = riderEmail;
        }
        if (deliveryStatus) {
            query.deliveryStatus = deliveryStatus;
        }

        const result = await parcelCollection.find(query).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/parcels/:id', async (req, res) => {
    try {
        const { parcelCollection } = await connectToDatabase();
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await parcelCollection.findOne(query);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/parcels', async (req, res) => {
    try {
        const { parcelCollection } = await connectToDatabase();
        const parcel = req.body;
        parcel.createdAt = new Date();
        const result = await parcelCollection.insertOne(parcel);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.patch('/parcels/:id', async (req, res) => {
    try {
        const { parcelCollection, ridersCollection } = await connectToDatabase();
        const { riderId, riderName, riderEmail, riderPhone } = req.body;
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updatedDocs = {
            $set: {
                riderId,
                riderName,
                riderEmail,
                riderPhone,
                deliveryStatus: 'driver-assigned'
            }
        };
        const result = await parcelCollection.updateOne(query, updatedDocs);

        // Update rider information
        const riderQuery = { _id: new ObjectId(riderId) };
        const riderUpdatedDocs = {
            $set: {
                workStatus: 'in_delivery'
            }
        };
        await ridersCollection.updateOne(riderQuery, riderUpdatedDocs);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.delete('/parcels/:id', async (req, res) => {
    try {
        const { parcelCollection } = await connectToDatabase();
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await parcelCollection.deleteOne(query);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ===== PAYMENT ROUTES =====
app.post('/create-checkout-session', async (req, res) => {
    try {
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
        });
        res.send({ url: session.url });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.patch('/payment-success', async (req, res) => {
    try {
        const { parcelCollection, paymentCollection } = await connectToDatabase();
        const sessionId = req.body.session_id;

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const transactionId = session.payment_intent;
        const query = { transactionId };

        const paymentExist = await paymentCollection.findOne(query);

        if (paymentExist) {
            return res.send({
                message: "Already exist",
                transactionId,
                trackingId: paymentExist.trackingId
            });
        }

        const trackingId = generateTrackingId();

        if (session.payment_status === 'paid') {
            const id = session.metadata.parcelId;
            const parcelQuery = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    paymentStatus: 'paid',
                    deliveryStatus: 'pending-pickup',
                    trackingId
                }
            };
            const result = await parcelCollection.updateOne(parcelQuery, update);

            const payment = {
                amount: session.amount_total / 100,
                currency: session.currency,
                customer_email: session.customer_email,
                parcelID: session.metadata.parcelID,
                parcelName: session.metadata.parcelName,
                transactionId: session.payment_intent,
                paymentStatus: session.payment_status,
                paidAt: new Date(),
                trackingId
            };

            const paymentResult = await paymentCollection.insertOne(payment);
            return res.send({
                success: true,
                modifyParcel: result,
                trackingId,
                transactionId: session.payment_intent,
                paymentInfo: paymentResult
            });
        }
        res.send({ success: false });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/payments', VerifyFirebaseToken, async (req, res) => {
    try {
        const { paymentCollection } = await connectToDatabase();
        const email = req.query.email;
        const query = {};
        
        if (email) {
            query.customer_email = email;

            if (email !== req.decoded_email) {
                return res.status(403).send({ message: "Forbidden access" });
            }
        }
        
        const result = await paymentCollection.find(query).sort({ paidAt: -1 }).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.delete('/payments', async (req, res) => {
    try {
        const { paymentCollection } = await connectToDatabase();
        const result = await paymentCollection.deleteMany();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ===== RIDER ROUTES =====
app.get('/riders', async (req, res) => {
    try {
        const { ridersCollection } = await connectToDatabase();
        const { status, district, workStatus } = req.query;
        const query = {};
        
        if (status) {
            query.status = status;
        }
        if (district) {
            query.District = district;
        }
        if (workStatus) {
            query.workStatus = workStatus;
        }
        
        const result = await ridersCollection.find(query).sort({ createdAT: 1 }).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/riders', async (req, res) => {
    try {
        const { ridersCollection } = await connectToDatabase();
        const rider = req.body;
        rider.status = 'pending';
        rider.createdAT = new Date();

        const result = await ridersCollection.insertOne(rider);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.patch('/riders/:id', VerifyFirebaseToken, async (req, res) => {
    try {
        const { ridersCollection, usersCollection } = await connectToDatabase();
        const status = req.body.status;
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updatedDocs = {
            $set: {
                status,
                workStatus: 'available'
            }
        };
        const result = await ridersCollection.updateOne(query, updatedDocs);

        if (status === 'approved') {
            const email = req.body.email;
            const userQuery = { email };
            const updateUser = {
                $set: {
                    role: 'rider'
                }
            };
            await usersCollection.updateOne(userQuery, updateUser);
        }

        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.delete('/riders/:id', async (req, res) => {
    try {
        const { ridersCollection } = await connectToDatabase();
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await ridersCollection.deleteOne(query);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ===== ROOT ROUTE =====
app.get('/', (req, res) => {
    res.send('Let\'s start Zap-Shift 🚀');
});

// Export as serverless function for Vercel
module.exports = app;
