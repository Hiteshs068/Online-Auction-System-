// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const argon2 = require("argon2");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");



const app = express();
const PORT = 5000;
const mongoURI = "mongodb://127.0.0.1:27017/online-auction-system";

// Middleware setup
app.use(cors({ origin: "http://localhost:5500", credentials: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 },
  })
);

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const conn = mongoose.connection;


let gfs, gridFSBucket;

conn.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("✅ GridFS Initialized");
});

// Configure Multer GridFS Storage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => ({ filename: `${Date.now()}-${file.originalname}`, bucketName: "uploads" }),
});
const upload = multer({ storage });

// Modify User Schema to Store Image Filenames
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, match: /^\d{10}$/ },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String }, // Store Profile Picture Filename
  identityProof: { type: String }, // Store Proof of Identity Filename
  proofType: { type: String } // Store Document Type (Aadhar, PAN, etc.)
});

const User = mongoose.model("User", userSchema);



const auctionSchema = new mongoose.Schema({
  auctionId: { type: String, unique: true, required: true },
  itemName: String,
  itemImage: String, // Store filename instead of ObjectId
  basePrice: Number,
  startDate: Date,
  endDate: Date,
  itemDetails: String,
  auctionType: String,
  category: String,
  sellerEmail: String,
  numBidders: String,
  sellerName: String,
  address: String,
  country: String,
  mobile: String,
  education: String,
  bankDetails: {
    holderName: String,
    bankName: String,
    ifscCode: String,
    accountNumber: String,
    upiId: String,
  },
  status: { type: String, default: "not verified" },
});


const Auction = mongoose.model("Auction", auctionSchema);

const auctionSchema2 = new mongoose.Schema({
  auctionId: { type: String, unique: true, required: true },
  itemName: String,
  itemImage: String, // Store filename instead of ObjectId
  basePrice: Number,
  startDate: Date,
  endDate: Date,
  itemDetails: String,
  auctionType: String,
  category: String,
  sellerEmail: String,
  numBidders: String,
  sellerName: String,
  address: String,
  country: String,
  mobile: String,
  education: String,
  bankDetails: {
    holderName: String,
    bankName: String,
    ifscCode: String,
    accountNumber: String,
    upiId: String,
  },
  status: { type: String, default: "not verified" },
});


const Auction2 = mongoose.model("HistoryAuction", auctionSchema2);


const statusAuctionSchema = new mongoose.Schema({
  auctionId: { type: String, unique: true, required: true },
  itemName: String,
  itemImage: String,
  basePrice: Number,
  sellerEmail: String,
  sellerName: String,
  status: { type: String, default: "pending" },
});
const StatusAuction = mongoose.model("StatusAuction", statusAuctionSchema);

// Routes
app.get("/", (req, res) => res.sendFile(__dirname + "/public/signin.html"));

// Signup Route
app.post("/signup", upload.fields([{ name: "profileImage" }, { name: "identityProof" }]), async (req, res) => {
  const { name, email, mobile, dob, gender, password, proofType } = req.body;

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await argon2.hash(password);
      const newUser = new User({
          name,
          email,
          mobile,
          dob,
          gender,
          password: hashedPassword,
          profileImage: req.files["profileImage"] ? req.files["profileImage"][0].filename : null,
          identityProof: req.files["identityProof"] ? req.files["identityProof"][0].filename : null,
          proofType
      });

      await newUser.save();
      res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
      res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await argon2.verify(user.password, password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.session.email = email;
    res.json({ message: "Login successful", email, redirect: "/dashboard.html" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// ✅ API 1: Check if email exists
app.post("/check-email", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
      res.json({ success: true });
  } else {
      res.json({ success: false, message: "Email not found" });
  }
});

// ✅ API 2: Reset Password
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  
  const hashedPassword = await argon2.hash(newPassword, 10); // Hash the new password for security

  const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
  );

  if (updatedUser) {
      res.json({ success: true, message: "Password successfully updated!" });
  } else {
      res.json({ success: false, message: "Error updating password." });
  }
});


// API to fetch upcoming auctions
app.get("/api/upcoming-auctions", async (req, res) => {
  try {
    const today = new Date();
    const upcomingAuctions = await Auction.find({ startDate: { $gte: today } }).sort({ startDate: 1 });
    res.json(upcomingAuctions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
});



async function generateUniqueAuctionId() {
  let auctionId;
  do {
    auctionId = Math.floor(10000000 + Math.random() * 90000000).toString();
  } while (await Auction.exists({ auctionId }));
  return auctionId;
}

app.post("/create-auction", upload.single("itemImage"), async (req, res) => {
  if (!req.session.email) {
    return res.status(403).json({ message: "You must be logged in to create an auction." });
  }
  try {
    const auctionId = await generateUniqueAuctionId();

    const newAuction = new Auction({
      auctionId,
      itemName: req.body.itemName,
      itemImage: req.file.filename, // Save filename instead of ObjectId
      basePrice: req.body.basePrice,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      itemDetails: req.body.itemDetails,
      auctionType: req.body.auctionType,
      category: req.body.category,
      sellerEmail: req.session.email,
      numBidders:req.body.numBidders,
      sellerName: req.body.sellerName,
      address: req.body.address,
      country: req.body.country,
      mobile: req.body.mobile,
      education: req.body.education,
      bankDetails: {
        holderName: req.body.holderName,
        bankName: req.body.bankName,
        ifscCode: req.body.ifscCode,
        accountNumber: req.body.accountNumber,
        upiId:req.body.upiId,
      },
    });
    await newAuction.save();

    const newAuction2 = new Auction2({
      auctionId,
      itemName: req.body.itemName,
      itemImage: req.file.filename, // Save filename instead of ObjectId
      basePrice: req.body.basePrice,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      itemDetails: req.body.itemDetails,
      auctionType: req.body.auctionType,
      category: req.body.category,
      sellerEmail: req.session.email,
      numBidders:req.body.numBidders,
      sellerName: req.body.sellerName,
      address: req.body.address,
      country: req.body.country,
      mobile: req.body.mobile,
      education: req.body.education,
      bankDetails: {
        holderName: req.body.holderName,
        bankName: req.body.bankName,
        ifscCode: req.body.ifscCode,
        accountNumber: req.body.accountNumber,
        upiId:req.body.upiId,
      },
    });
    await newAuction2.save();

    const newStatusAuction = new StatusAuction({
      auctionId,
      itemName: req.body.itemName,
      itemImage: req.file.filename,
      basePrice: req.body.basePrice,
      sellerEmail: req.session.email,
      sellerName: req.body.sellerName,
      status: req.body.status || "pending",
    });
    await newStatusAuction.save();
    res.status(201).json({ message: "Auction created successfully!", auctionId });
  } catch (err) {
    res.status(500).json({ message: "Error creating auction", error: err.message });
  }
});


const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);
// Handle admin login requests
app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Find admin in the database
      const admin = await Admin.findOne({ username });

      if (!admin) {
          return res.json({ success: false, message: 'Admin not found?..' });
      }

      // Check if the password matches
      if (admin.password === password) {
          return res.json({ success: true, message: 'Login successful' });
      } else {
          return res.json({ success: false, message: 'Invalid password!..' });
      }
  } catch (err) {
      console.error(err);
      res.json({ success: false, message: 'An error occurred, please try again' });
}
});






// Fetch images from GridFS
app.get("/image/:filename", async (req, res) => {
    try {
      const file = await gfs.files.findOne({ filename: req.params.filename });
  
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
  
      const readStream = gridFSBucket.openDownloadStream(file._id);
      readStream.pipe(res);
    } catch (error) {
      res.status(500).json({ message: "Error fetching image", error: error.message });
    }
  });
  
  
// Fetch all auctions
app.get("/api/auctions", async (req, res) => {
  try {
    const auctions = await Auction.find({ status: "verified" }); // Only fetch verified auctions
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching auctions", error: error.message });
  }
});


// Fetch auction status
// Fetch only pending auctions
app.get("/pending-auctions", async (req, res) => {
    try {
      const auctions = await Auction.find({ status: "not verified" });
      res.json(auctions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending auctions", error: error.message });
    }
  });
  

  // Update auction status (verify or reject)
  app.post("/update-auction-status", async (req, res) => {
    const { auctionId, status } = req.body;
  
    try {
      // Find and update the auction in the main Auction collection
      const auction = await Auction.findOne({ auctionId });
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }
      auction.status = status;
      await auction.save();
  
      // Find and update the auction in the StatusAuction collection
      const statusAuction = await StatusAuction.findOne({ auctionId });
      if (!statusAuction) {
        return res.status(404).json({ message: "Status Auction not found" });
      }
      statusAuction.status = status;
      await statusAuction.save();
  
      res.json({ message: `Auction ${status} successfully` });
    } catch (error) {
      res.status(500).json({ message: "Error updating auction status", error: error.message });
    }
  });
  
  // Reject auction
  app.put("/api/rejectAuction/:auctionId", async (req, res) => {
    try {
      const { auctionId } = req.params;
  
      // Find and update in Auction collection
      const auction = await Auction.findOne({ auctionId });
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }
      auction.status = "rejected";
      await auction.save();
      await Auction.deleteOne({ auctionId });
  
      // Find and update in StatusAuction collection
      const statusAuction = await StatusAuction.findOne({ auctionId });
      if (!statusAuction) {
        return res.status(404).json({ message: "Status Auction not found" });
      }
      statusAuction.status = "rejected";
      await statusAuction.save();
  
      res.json({ message: "Auction rejected successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error rejecting auction", error: error.message });
    }
  });
  
//updateing
app.put("/api/updateAuction/:auctionId", async (req, res) => {
    const { auctionId } = req.params;
    try {
        // Update status in both collections
        await Auction.updateOne({ auctionId }, { $set: { status: "verified" } });
        await Auction2.updateOne({ auctionId }, { $set: { status: "verified" } });
        await StatusAuction.updateOne({ auctionId }, { $set: { status: "verified" } });

        res.json({ message: "Auction verified successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update auction status" });
    }
});

//deleting
app.delete("/api/deleteAuction/:auctionId", async (req, res) => {
    const { auctionId } = req.params;
    try {
        // Delete auction from Auction schema
        await Auction.deleteOne({ auctionId });

        // Update status in statusAuction schema
        await StatusAuction.updateOne({ auctionId }, { $set: { status: "rejected" } });

        res.json({ message: "Auction rejected and removed" });
    } catch (error) {
        res.status(500).json({ error: "Failed to reject auction" });
    }
});


// Fetch auction status
app.get("/api/auction-status", async (req, res) => {
    try {
      const auctions = await StatusAuction.find(); // FIXED: Correct Model Reference
      res.json(auctions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching auction status", error: error.message });
    }
  });
// Fetch user profile
app.get("/profile", async (req, res) => {
  if (!req.session?.email) return res.status(403).json({ message: "Unauthorized" });

  try {
      const user = await User.findOne({ email: req.session.email }).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
  } catch (err) {
      res.status(500).json({ message: "Error fetching profile data", error: err.message });
  }
});

// Fetch images from GridFS
app.get("/image/:filename", async (req, res) => {
  try {
      const file = await gfs.files.findOne({ filename: req.params.filename });

      if (!file) {
          return res.status(404).json({ message: "File not found" });
      }

      const readStream = gridFSBucket.openDownloadStream(file._id);
      readStream.pipe(res);
  } catch (error) {
      res.status(500).json({ message: "Error fetching image", error: error.message });
  }
});







// Bid Schema
const bidSchema = new mongoose.Schema({
  auctionId: String,
  bidderEmail: String,
  bidAmount: Number,
  bidTime: { type: Date, default: Date.now },
});

const Bid = mongoose.model("Bid", bidSchema);

// API to submit a new bid
app.post("/api/place-bid", async (req, res) => {
  const { auctionId, bidAmount, auctionType } = req.body;
  const bidderEmail = req.session.email; // Assuming session-based authentication

  if (!bidderEmail) {
      return res.status(401).json({ message: "User not authenticated" });
  }

  // Fetch current bid based on auction type (Highest for English, Lowest for Dutch)
  const currentBid = await Bid.findOne({ auctionId }).sort({ bidAmount: auctionType === "dutch" ? 1 : -1 }).exec();

  // Bid validation based on auction type
  if (auctionType === "english") {
      if (currentBid && bidAmount <= currentBid.bidAmount) {
          return res.status(400).json({ message: "English Auction: Your bid must be higher than the current bid." });
      }
  } else if (auctionType === "dutch") {
      if (currentBid && bidAmount >= currentBid.bidAmount) {
          return res.status(400).json({ message: "Dutch Auction: Your bid must be lower than the current bid." });
      }
  } else {
      return res.status(400).json({ message: "Invalid auction type" });
  }

  // Store the bid in the database
  const newBid = new Bid({ auctionId, bidderEmail, bidAmount, bidTime: new Date() });
  await newBid.save();

  res.status(201).json({ message: "Bid placed successfully" });
});

// API to get top bids for an auction
app.get("/api/get-bids/:auctionId", async (req, res) => {
  const { auctionId } = req.params;
  const bids = await Bid.find({ auctionId }).sort({ bidAmount: -1 }).limit(5);
  res.json(bids);
});



// Winner Schema
// Winner Schema (Updated Collection Name)
const winnerSchema = new mongoose.Schema({
  auctionId: String,
  itemName: String,
  winnerName: String,
  winnerEmail: String,
  winningBid: Number,
 
});
const Winner = mongoose.model("winners", winnerSchema); // ✅ Collection renamed to "winners"

// API: Get Bidders List for an Auction
app.get("/api/get-bids/:auctionId", async (req, res) => {
  try {
      const { auctionId } = req.params;

      // Fetch auction type from the database
      const auction = await Auction.findOne({ auctionId });
      if (!auction) {
          return res.status(404).json({ error: "Auction not found" });
      }

      const auctionType = auction.auctionType.toLowerCase(); // Ensure type is lowercase
      const sortOrder = auctionType === "dutch" ? 1 : -1;  // Dutch: Ascending, English: Descending

      // Fetch bids sorted based on auction type
      const bids = await Bid.find({ auctionId }).sort({ bidAmount: sortOrder, bidTime: -1 });

      res.json(bids);
  } catch (error) {
      console.error("Error fetching bids:", error);
      res.status(500).json({ error: "Error fetching bids" });
  }
});


// API: Store and Fetch Winner Details
app.get("/api/auction-winner/:auctionId", async (req, res) => {
  try {
    const { auctionId } = req.params;

    // ✅ Check if the auction exists
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found." });
    }

    // ✅ Ensure the auction has ended before selecting a winner
    const now = new Date();
    if (now < new Date(auction.endDate)) {
      return res.status(400).json({ message: "Auction is still active. Winner not determined yet." });
    }

    // ✅ Check if the winner is already stored
    let winner = await Winner.findOne({ auctionId });

    if (!winner) {
      // ✅ Determine auction type & fetch winner accordingly
      const auctionType = auction.auctionType.toLowerCase();
      const sortOrder = auctionType === "dutch" ? 1 : -1; // Dutch (Lowest Wins) | English (Highest Wins)

      // ✅ Fetch the winning bid
      const winningBid = await Bid.findOne({ auctionId }).sort({ bidAmount: sortOrder }).exec();
      if (!winningBid) {
        return res.status(404).json({ message: "No valid bids found." });
      }

      // ✅ Fetch winner details from "users" collection
      const winnerDetails = await User.findOne({ email: winningBid.bidderEmail });

      // ✅ Store winner in the "winners" collection
      winner = new Winner({
        auctionId,
        itemName: auction.itemName, // Item name from auction
        winnerName: winnerDetails ? winnerDetails.name : winningBid.bidderEmail.split("@")[0],
        winnerEmail: winningBid.bidderEmail,
        winningBid: winningBid.bidAmount
      });

      await winner.save();
    }

    // ✅ Check if the logged-in user is the winner
    const loggedInEmail = req.session.email;
    const isWinner = loggedInEmail && winner.winnerEmail === loggedInEmail;

    res.json({ winner: isWinner, auction: winner });
  } catch (error) {
    console.error("Error fetching winner details:", error);
    res.status(500).json({ error: "Error fetching winner details." });
  }
});








// Winners Collection Schema  cart section api

app.get("/api/my-won-items", async (req, res) => {
  try {
      const loggedInEmail = req.session.email;
      if (!loggedInEmail) {
          return res.status(401).json({ error: "User not logged in" });
      }

      // Step 1: Fetch won items where winnerEmail matches logged-in user
      const wonItems = await Winner.find({ winnerEmail: loggedInEmail });

      // Step 2: Fetch auction details for each won item
      const auctionDetails = await Promise.all(
          wonItems.map(async (winner) => {
              const auction = await Auction.findOne({ _id: new mongoose.Types.ObjectId(winner.auctionId) });

              if (!auction) return null;

              return {
                  auctionId: winner.auctionId,
                  itemName: auction.itemName,
                  itemImage: auction.itemImage,
                  itemDetails: auction.itemDetails,
                  category: auction.category,
                  sellerEmail: auction.sellerEmail,
                  sellerName: auction.sellerName,
                  address: auction.address,
                  country: auction.country,
                  mobile: auction.mobile,
                  education: auction.education,
                  holderName: auction.bankDetails?.holderName,
                  bankName: auction.bankDetails?.bankName,
                  ifscCode: auction.bankDetails?.ifscCode,
                  accountNumber: auction.bankDetails?.accountNumber,
                  upiId: auction.bankDetails?.upiId,

                  winnerName: winner.winnerName,
                  winnerEmail: winner.winnerEmail,
                  winningBid: winner.winningBid
              };
          })
      );

      res.json(auctionDetails.filter(item => item !== null)); // Remove null entries if any
  } catch (error) {
      console.error("Error fetching won items:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


// store applied user for auction 
const appliedBidderSchema = new mongoose.Schema({
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
  auctionType: { type: String, required: true }
});

const AppliedBidder = mongoose.model("AppliedBidder", appliedBidderSchema);
module.exports = AppliedBidder;

// **Apply Now API** (Stores Applied Users)
app.get("/apply-now", async (req, res) => {
  try {
      const { auctionId } = req.query;
      const email = req.session.email;

      if (!email || !auctionId) {
          return res.status(400).json({ success: false, message: "Missing required data" });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const auction = await Auction.findById(auctionId);
      if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });

      const maxBidders = auction.numBidders;
      const appliedCount = await AppliedBidder.countDocuments({ auctionId });

      const existingApplication = await AppliedBidder.findOne({ auctionId, email });
      if (existingApplication) {
          return res.json({ success: false, message: "You have already applied" });
      }

      if (appliedCount >= maxBidders) {
          return res.json({ success: false, message: "Max bidders reached" });
      }

      const newAppliedBidder = new AppliedBidder({
          auctionId,
          email,
          name: user.name,
          auctionType: auction.auctionType
      });

      await newAppliedBidder.save();

      res.json({
          success: true,
          message: "Applied successfully",
          remainingSlots: maxBidders - (appliedCount + 1)
      });

  } catch (error) {
      console.error("Error in /apply-now:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});

// **Fetch Applied Status API**
app.get("/applied-status", async (req, res) => {
  try {
      const { auctionId } = req.query;
      const email = req.session.email;

      if (!auctionId || !email) {
          return res.status(400).json({ success: false, message: "Missing data" });
      }

      const auction = await Auction.findById(auctionId);
      if (!auction) {
          return res.status(404).json({ success: false, message: "Auction not found" });
      }

      const appliedCount = await AppliedBidder.countDocuments({ auctionId });
      const maxBidders = auction.numBidders;
      const remainingSlots = maxBidders - appliedCount;
      const isApplied = await AppliedBidder.findOne({ auctionId, email }) ? true : false;

      res.json({
          success: true,
          appliedCount,
          remainingSlots,
          isApplied
      });

  } catch (error) {
      console.error("Error in /applied-status:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});


// ✅ API to Fetch Admin Earnings
app.get("/api/admin-earnings", async (req, res) => {
  try {
    // ✅ Winners collection se sabhi winning bids fetch karo
    const winners = await Winner.find();

    // ✅ Sabhi winning bids ka 5% calculate karo (admin earnings)
    let totalEarnings = winners.reduce((sum, winner) => {
      return sum + (winner.winningBid * 0.05); // 5% calculate
    }, 0);

    res.json({ earnings: totalEarnings.toFixed(2) }); // 2 decimal places
  } catch (error) {
    console.error("Error fetching admin earnings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Logout Error:', err);
          return res.status(500).send("Logout failed");
      }
      res.redirect('/login.html'); // Redirect after logout
  });
});

// Middleware to prevent accessing pages after logout
function checkAuth(req, res, next) {
  if (!req.session.email) {
      return res.redirect('/login.html'); // Redirect if session doesn't exist
  }
  next();
}

// Protect auction & dashboard pages
app.get('/dashboard', checkAuth, (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});






// ✅ Get all users
app.get("/api/users", async (req, res) => {
  try {
      const users = await User.find();
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get user by ID
app.get("/api/users/:userId", async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
  } catch (error) {
      res.status(500).json({ error: "Error fetching user details" });
  }
});



// ✅ Edit user by ID (with file upload)
app.put("/api/users/:userId", async (req, res) => {
  try {
      const { name, email, mobile, dob, gender, proofType } = req.body;

      // Fetch the existing user to retain images
      const existingUser = await User.findById(req.params.userId);
      if (!existingUser) {
          return res.status(404).json({ error: "User not found" });
      }

      // Update user details without modifying images
      const updatedUser = await User.findByIdAndUpdate(
          req.params.userId,
          {
              name: name || existingUser.name,
              email: email || existingUser.email,
              mobile: mobile || existingUser.mobile,
              dob: dob || existingUser.dob,
              gender: gender || existingUser.gender,
              proofType: proofType || existingUser.proofType,
          },
          { new: true }
      );

      res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
      res.status(500).json({ error: "Error updating user" });
  }
});

// ✅ Delete user by ID
app.delete("/api/users/:userId", async (req, res) => {
  try {
      const deletedUser = await User.findByIdAndDelete(req.params.userId);
      if (!deletedUser) {
          return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
  }
});



// fetch winners detail for admin 
app.get("/api/winners", async (req, res) => {
  try {
      const winners = await Winner.find();
      res.json(winners);
  } catch (error) {
      res.status(500).json({ message: "Error fetching winners", error });
  }
});


// fetch admin details for admin panel 
// API to fetch admin profile (without exposing password)
app.get("/api/admin", async (req, res) => {
  try {
      const admin = await Admin.findOne({}, { password: 0 }); // Exclude password
      res.json(admin);
  } catch (error) {
      res.status(500).json({ message: "Error fetching admin details", error });
  }
});



// logout api for admin panel 

app.get('/api/auctions', async (req, res) => {
  try {
      const auctions = await Auction.find().lean(); // Get all auctions
      res.json(auctions);
  } catch (error) {
      console.error("Error fetching auctions:", error);
      res.status(500).json({ error: "Server error" });
  }
});

// Delete an auction
app.delete('/api/auctions/:auctionId', async (req, res) => {
  try {
      const { auctionId } = req.params;
      await Auction.deleteOne({ auctionId });
      res.json({ message: "Auction deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Failed to delete auction" });
  }
});
app.get("/admin-dashboard-stats", async (req, res) => {
  try {
    // Total auctions (from both active and history)
    const totalAuctions = await Auction2.countDocuments();

    // Active auctions (Auction collection with status "verified")
    const activeAuctions = await Auction.countDocuments({ status: "verified" });

    // Upcoming auctions (Auction collection with status "not verified")
    const upcomingAuctions = await Auction.countDocuments({ status: "not verified" });

    // Completed auctions (HistoryAuction collection with status "verified")
    const completedAuctions = await Auction2.countDocuments({ status: "verified" });

    // Registered users count
    const totalUsers = await User.countDocuments();

    res.json({
      totalAuctions,
      activeAuctions,
      upcomingAuctions,
      completedAuctions,
      totalUsers,
      totalEarnings: "$0", // No logic needed for earnings yet
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/admin-logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Admin Logout Error:', err);
          return res.status(500).send("Logout failed");
      }
      res.redirect('/login-admin.html');  // Redirect after logout
  });
});

// Middleware to prevent access after logout
function checkAdminAuth(req, res, next) {
  if (!req.session.adminEmail) {
      return res.redirect('/login-admin.html');  // Redirect if no session
  }
  next();
}

// Protect admin pages
app.get('/admin-dashboard', checkAdminAuth, (req, res) => {
  res.sendFile(__dirname + '/admin-dashboard.html');
});





// ✅ Serve Admin Page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
