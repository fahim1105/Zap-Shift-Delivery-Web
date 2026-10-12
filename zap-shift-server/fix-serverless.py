#!/usr/bin/env python3
import re

# Read file
with open('index.js', 'r') as f:
    content = f.read()

# Find the start of async function run()
run_start = content.find('async function run() {')
run_end = content.find('run().catch(console.dir);')

# Extract the routes section (everything inside run function)
routes_section = content[run_start:run_end]

# Remove the first few lines of setup inside run()
# Find where actual routes start (after collection definitions)
routes_start_marker = '        // User Related Api'
routes_start_idx = routes_section.find(routes_start_marker)

# Extract just the routes
routes_only = routes_section[routes_start_idx:]

# Remove the ping command and closing braces at the end
routes_only = routes_only[:routes_only.find('        // Send a ping')]

# Remove 8-space indentation (routes were inside the async function)
routes_fixed = re.sub(r'^        ', '', routes_only, flags=re.MULTILINE)

# Add collection getter at each route
routes_fixed = routes_fixed.replace(
    'usersCollection.', 
    '(await connectToDatabase()).usersCollection.'
)
routes_fixed = routes_fixed.replace(
    'parcelCollection.', 
    '(await connectToDatabase()).parcelCollection.'
)
routes_fixed = routes_fixed.replace(
    'paymentCollection.', 
    '(await connectToDatabase()).paymentCollection.'
)
routes_fixed = routes_fixed.replace(
    'ridersCollection.', 
    '(await connectToDatabase()).ridersCollection.'
)

# Build new file
before_run = content[:run_start]
after_run = content[run_end + len('run().catch(console.dir);'):]

# Add connection helper
connection_code = """
// Global connection cache for serverless
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

// Middleware for admin (updated to use connectToDatabase)
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

"""

new_content = before_run + connection_code + routes_fixed + "\n" + after_run

# Write new file
with open('index.js', 'w') as f:
    f.write(new_content)

print("✅ Fixed index.js for serverless!")
