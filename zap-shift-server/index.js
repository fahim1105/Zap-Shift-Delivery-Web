const express = require('express')
const cors = require('cors')
const app = express()

require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const port = process.env.PORT || 3000

const crypto = require("crypto");

function generateTrackingId() {
    const prefix = "ZAP";
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    return \`\${prefix}-\${date}-\${random}\`;
}

// Firebase SDK
const admin = require("firebase-admin");
const serviceAccount = require("./zap-shift-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Middleware
app.use(express.json());
app.use(cors());

const VerifyFirebaseToken = async (req, res, next) => {
    const Token = req.headers.authorization;
    if (!Token) {
        return res.status(401).send({ message: 'Unauthorized access' })
    }
    try {
        const tokenId = Token.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(tokenId);
        req.decoded_email = decoded.email;
        next()
    }
    catch (err) {
        return res.status(401).send({ message: "Unauthorized access" });
    }
}

const uri = \`mongodb+srv://\${process.env.DB_user}:\${process.env.DB_pass}@cluster0.mcccn4v.mongodb.net/?appName=Cluster0\`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Global connection
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
        return res.send({ message: "Forbidden access" })
    }
    next()
}

// === USER ROUTES ===
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
        res.send({ role: user?.role || 'user' })
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
        const userExist = await usersCollection.findOne({ email })
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
        }
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

// === PARCEL ROUTES ===
app.get('/parcels', async (req, res) => {
    try {
        const { parcelCollection } = await connectToDatabase();
        const query = {}
        const { email, deliveryStatus } = req.query;
        
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
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Root route
app.get('/', (req, res) => {
    res.send('Let\'s start Zap-Shift 🚀')
});

// For local development only
if (process.env.VERCEL !== '1') {
    connectToDatabase().then(() => {
        app.listen(port, () => {
            console.log(`Server started on port ${port}`)
        })
    });
}

// Export for Vercel serverless
module.exports = app;
