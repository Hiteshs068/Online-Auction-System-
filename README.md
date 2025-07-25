🏷️ Online Auction System
A robust backend application for an online auction platform built using Node.js, Express, and MongoDB. This system enables users to securely register, upload auction items, and manage bids with session handling, file uploads (using GridFS), and real-time operations—all structured with production-grade scalability and modularity.

🚀 Features
User registration & login with sessions

Password hashing using argon2

File uploads (e.g., product images) via multer-gridfs-storage

Session-based authentication

Admin & bidder role management (if implemented)

Real-time auction data stored in MongoDB

Image and file handling using MongoDB GridFS

RESTful API integration

Secure cookie-based session storage

CORS enabled for frontend integration

🧰 Tech Stack
Layer	Tech
Backend	Node.js, Express, MongoDB, Mongoose, Argon2, Multer, GridFS
Utilities	dotenv, express-session, body-parser, CORS, Nodemailer (optional)
Dev Tools	nodemon, SweetAlert2

⚙️ Installation Instructions
1. Clone the repository
bash
Copy
Edit
git clone https://github.com/<your-username>/online-auction-system.git
cd online-auction-system
2. Install backend dependencies
bash
Copy
Edit
npm install
3. Start the backend server
bash
Copy
Edit
npm start
Runs on http://localhost:5000

📡 API Endpoints
All backend routes are available under / unless modularized into specific prefixes.

Method	Endpoint	Description
POST	/login	Login user with session
POST	/register	Register new user
POST	/upload	Upload product images (GridFS)
GET	/products	Fetch available auction items
GET	/logout	Logout and destroy session
GET	/images/:id	Access uploaded image by ID

📌 Routes may vary depending on implementation. Check server.js or routes/.

📁 Folder Structure
bash
Copy
Edit
Hitesh/
├── node_modules/
├── public/                 # Static assets
├── server.js               # Entry point
├── package.json            # Dependencies
└── .env                    # Environment variables (create this file)
🔐 Environment Variables
Create a .env file in the root directory with the following:

env
Copy
Edit
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/online-auction-system
SESSION_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5500
🛡️ Security Practices
Passwords hashed using Argon2 (memory-safe)

MongoDB session store via connect-mongo

File uploads are scanned and stored securely using GridFS

Cookies secured with httpOnly & sameSite flags

Environment-based config management

📄 License
This project is licensed under the MIT License.

🙋 Author
Hitesh Shukla
Backend Developer | Full Stack Enthusiast
📧 shuklahitesh492@gmail.com
🔗 GitHub | LinkedIn
