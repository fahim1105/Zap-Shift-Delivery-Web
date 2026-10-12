# 🚀 ZapShift - Modern Parcel Delivery Management System

## 📝 Project Description

ZapShift is a comprehensive web-based parcel delivery management platform designed to streamline the entire logistics workflow. The system connects customers, delivery riders, and administrators through an intuitive interface, enabling efficient parcel booking, real-time tracking, and seamless payment processing.

Built with modern technologies like React, Express.js, MongoDB, and Firebase Authentication, ZapShift provides a scalable solution for delivery service providers to manage their operations effectively.

### Key Features:
- **User Management:** Multi-role system (User, Rider, Admin) with Firebase authentication
- **Parcel Booking:** Easy-to-use interface for booking and tracking parcels
- **Payment Integration:** Stripe payment gateway for secure transactions
- **Real-time Tracking:** Generate unique tracking IDs for each parcel
- **Rider Management:** Approve riders and assign deliveries
- **Dashboard Analytics:** Visual representation of delivery statistics
- **Responsive Design:** Mobile-friendly interface using TailwindCSS and DaisyUI

---

## 🛠️ Technology Stack

### Frontend:
- **Framework:** React 18 with Vite
- **Routing:** React Router v7
- **UI Libraries:** TailwindCSS, DaisyUI
- **State Management:** TanStack Query (React Query)
- **Authentication:** Firebase Authentication
- **Animations:** Framer Motion, AOS
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **Image Upload:** ImgBB API
- **Deployment:** Cloudflare Pages

### Backend:
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Firebase Admin SDK
- **Payment:** Stripe API
- **Deployment:** Vercel Serverless Functions
- **Environment:** dotenv for configuration

---

## 🚧 Challenges Faced

### 1. **Vercel Serverless Deployment Issues**
**Challenge:** Express.js routes were not working on Vercel serverless environment, returning 404 errors despite successful local testing.

**Root Cause:** 
- Vercel treats files in `/api` folder as individual serverless endpoints
- Express app routing conflicts with Vercel's serverless architecture
- Middleware and route initialization were wrapped inside async functions

**Solution:**
- Simplified project structure by moving all code to root `index.js`
- Configured proper `vercel.json` with builds and routes
- Set up environment variables directly in Vercel dashboard
- Implemented database connection caching for serverless optimization

### 2. **Firebase Admin SDK Path Resolution**
**Challenge:** Firebase service account JSON file path was breaking when restructuring for Vercel.

**Resolution:** Updated relative paths from `../` to `./` when moving from `/api` folder to root.

### 3. **MongoDB Connection in Serverless**
**Challenge:** Traditional MongoDB connection with `app.listen()` doesn't work in serverless environments.

**Solution:** 
- Implemented connection caching using global variables
- Created `connectToDatabase()` function that reuses connections
- Removed `app.listen()` for Vercel deployment while keeping it for local development

### 4. **Environment Variables Synchronization**
**Challenge:** Local `.env` variables weren't available in Vercel deployment.

**Resolution:** Used Vercel CLI to add all environment variables:
```bash
vercel env add DB_user production
vercel env add DB_pass production
vercel env add STRIPE_SECRET production
vercel env add SITE_DOMAIN production
```

### 5. **CORS and API Base URL Management**
**Challenge:** Frontend needed to communicate with different backend URLs in development vs production.

**Solution:**
- Used Vite's `import.meta.env.VITE_API_BASE_URL` for dynamic configuration
- Updated `.env` file with production Vercel URL
- Configured CORS properly in Express backend

---

## 🔮 Future Plans

### Short-term Enhancements:
1. **Real-time Notifications**
   - Implement WebSocket/Socket.io for live delivery updates
   - Push notifications for status changes
   - SMS alerts for important milestones

2. **Advanced Tracking**
   - GPS integration for real-time rider location
   - Map view with route visualization
   - Estimated delivery time calculations

3. **Enhanced Analytics**
   - Detailed revenue reports
   - Rider performance metrics
   - Customer satisfaction ratings

4. **Payment Improvements**
   - Multiple payment gateways (PayPal, local options)
   - Wallet system for frequent users
   - Promo code and discount management

### Mid-term Goals:
5. **Mobile Application**
   - React Native app for both customers and riders
   - Offline mode for basic operations
   - Camera integration for proof of delivery

6. **AI/ML Integration**
   - Smart route optimization for riders
   - Delivery time prediction using ML models
   - Fraud detection system

7. **Multi-language Support**
   - Internationalization (i18n)
   - Support for Bengali and English initially
   - RTL support for future expansion

8. **Advanced Admin Tools**
   - Bulk operations for parcel management
   - Automated rider assignment based on location
   - Export data to Excel/PDF

### Long-term Vision:
9. **Marketplace Features**
   - Allow multiple delivery companies to onboard
   - Customer reviews and ratings
   - Price comparison and bidding system

10. **Integration APIs**
    - Public API for third-party integration
    - E-commerce platform plugins (WooCommerce, Shopify)
    - Webhook support for external systems

11. **Blockchain for Transparency**
    - Immutable delivery records
    - Smart contracts for automated payments
    - Decentralized tracking system

12. **Sustainability Features**
    - Carbon footprint tracking
    - Green delivery options
    - Eco-friendly rider rewards

---

## 🌐 Live Links

- **Frontend (Cloudflare):** https://zap-shift-delivery.asifalfatthafahim12.workers.dev
- **Backend (Vercel):** https://zap-shift-server-two-hazel.vercel.app
- **GitHub Repository:** [Zap-Shift-Delivery-Web](https://github.com/fahim1105/Zap-Shift-Delivery-Web)

---

## 📦 Installation & Setup

### Prerequisites:
- Node.js (v18 or higher)
- MongoDB database
- Firebase project
- Stripe account

### Frontend Setup:
```bash
cd zap-shift
npm install
cp .env.example .env
# Add your environment variables
npm run dev
```

### Backend Setup:
```bash
cd zap-shift-server
npm install
cp .env.example .env
# Add your environment variables
npm start
```

---

## 🔑 Environment Variables

### Frontend (.env):
```
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_image_Host_Key=your_imgbb_api_key
VITE_API_BASE_URL=your_backend_url
```

### Backend (.env):
```
DB_user=your_mongodb_username
DB_pass=your_mongodb_password
STRIPE_SECRET=your_stripe_secret_key
SITE_DOMAIN=your_frontend_url
```

---

## 👨‍💻 Developer

**Asif Al Fattha Fahim**
- Email: asifalfatthafahim12@gmail.com
- GitHub: [@fahim1105](https://github.com/fahim1105)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Firebase for authentication services
- Stripe for payment processing
- MongoDB for database solutions
- Vercel and Cloudflare for hosting
- The open-source community for amazing libraries

---

**Built with ❤️ by Asif Al Fattha Fahim**
