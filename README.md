# 🛒 Online Auction System

A full-stack online auction system enabling real-time bidding, bidder management, auction scheduling, and secure participation. Built with **Node.js**, **Express**, **MongoDB**, and **vanilla JavaScript** for seamless backend and frontend integration. Ideal for learning web development concepts like REST APIs, user authentication, and real-time updates.

---

## 🚀 Features

- User registration and login system
- Auction creation with item image, base price, start & end time
- "Apply Now" before auction starts (limited to maximum bidders)
- "Bid Now" live bidding functionality for approved users
- Live countdown timer for each auction
- Real-time bid updates with validations
- Bidders list sorted by time and bid amount
- Bidding history stored in database
- Admin controls for result and auction management
- Bookmark auctions
- Responsive UI with clean design

---

## 🛠 Tech Stack

| Layer       | Tech Used                               |
|------------|------------------------------------------|
| Backend     | Node.js, Express, MongoDB, Mongoose     |
| Frontend    | HTML, CSS, JavaScript                   |
| Database    | MongoDB (collections: users, auctions, bids, apply) |
| APIs        | RESTful APIs for bids, applications, auctions |
| Tools       | Git, Postman, VS Code                   |

---

## 📁 Folder Structure

Hitesh/
├── client/ # Frontend files
│ ├── index.html
│ ├── styles.css
│ └── app.js
├── server/ # Backend files
│ ├── server.js
│ ├── routes/
│ ├── models/
│ └── controllers/
├── .gitignore
└── README.md

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/your-username/auction-app.git

# 2. Navigate to project directory
cd Hitesh

# 3. Install backend dependencies
cd server
npm install

# 4. Start the backend
node server.js

# 5. Open index.html in browser (or serve with Live Server)


📌 License
This project is built for learning and portfolio purposes.

Designed & Developed by Hitesh Shukla











