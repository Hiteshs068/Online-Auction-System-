function openTab(event, tabName) {
    // Prevent default behavior if the event is from a link
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    // Hide all tab content
    var tabcontent = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Show the current tab content
    var currentTab = document.getElementById(tabName);
    if (currentTab) {
        currentTab.style.display = "block";
    } else {
        console.error("Tab with ID '" + tabName + "' not found.");
    }

    // Remove the 'active' class from all tab buttons
    var tabButtons = document.getElementsByClassName("tab-button");
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    // Add the 'active' class to the button that opened the tab
    if (event && event.currentTarget) {
        event.currentTarget.classList.add("active");
    }
}

// Image Slider JavaScript
let slideIndex = 0;
let isSliding = false;

function showSlide(index) {
    const slides = document.querySelector('.slider');
    const totalSlides = slides.children.length;

    if (index >= totalSlides) slideIndex = 0;
    if (index < 0) slideIndex = totalSlides - 1;

    slides.style.transition = 'transform 1.5s ease-in-out';
    slides.style.transform = `translateX(-${slideIndex * 100}%)`;

    isSliding = true;

    setTimeout(() => {
        isSliding = false;
    }, 1500); // Sync with transition duration
}

function nextSlide() {
    if (!isSliding) {
        slideIndex++;
        showSlide(slideIndex);
    }
}

function prevSlide() {
    if (!isSliding) {
        slideIndex--;
        showSlide(slideIndex);
    }
}

function autoSlide() {
    nextSlide();
    setTimeout(autoSlide, 4000); 
}

setTimeout(autoSlide, 4000);



  
//show more and show less dashboard
function toggleAboutUs() {
    var aboutText = document.querySelector('.about-text');
    var showMoreBtn = document.getElementById('show-more');
    
    if (aboutText.style.height === '100px') {
      aboutText.style.height = 'auto';  // Show full text
      showMoreBtn.textContent = 'Show Less';  // Change button text
    } else {
      aboutText.style.height = '100px';  // Hide text
      showMoreBtn.textContent = 'Show More';  // Change button text
    }
  }


//auction tip list dashboard
  document.addEventListener("DOMContentLoaded", function () {
    const tipsContainer = document.getElementById("auction-tips-list");

    const auctionTips = [
        '<i class="fa-solid fa-magnifying-glass"></i> <strong>Research:</strong> Know the item before bidding.',
        '<i class="fa-solid fa-wallet"></i> <strong>Set a Budget:</strong> Avoid overbidding.',
        '<i class="fa-solid fa-bolt"></i> <strong>Bid Smart:</strong> Last-minute bids work best.',
        '<i class="fa-solid fa-bell"></i> <strong>Stay Updated:</strong> Enable auction alerts.',
        '<i class="fa-solid fa-user-check"></i> <strong>Verify Seller:</strong> Check ratings before bidding.',
        '<i class="fa-solid fa-clock"></i> <strong>Be Patient:</strong> Wait for the right deal.',
        '<i class="fa-solid fa-chart-line"></i> <strong>Know Value:</strong> Compare market prices.',
        '<i class="fa-solid fa-users"></i> <strong>Limited Bidders:</strong> Max slots fill fast.',
        '<i class="fa-solid fa-user-tie"></i> <strong>Apply First:</strong> Even sellers must apply.',
        '<i class="fa-solid fa-ban"></i> <strong>No Late Entries:</strong> Once full, applications close.',
        '<i class="fa-solid fa-gavel"></i> <strong>Winning Strategy:</strong> Observe before bidding.',
        '<i class="fa-solid fa-shield-alt"></i> <strong>Secure Payments:</strong> Use trusted methods.',
        '<i class="fa-solid fa-clipboard-check"></i> <strong>Read Rules:</strong> Know auction terms.',
        '<i class="fa-solid fa-eye"></i> <strong>Watch First:</strong> Monitor bids before placing yours.',
        '<i class="fa-solid fa-hand-holding-dollar"></i> <strong>Start Low:</strong> Gradually increase bids.'
    ];

    let tipIndex = 0;

    function showNextTip() {
        // Create new list item
        const newTip = document.createElement("li");
        newTip.innerHTML = auctionTips[tipIndex];

        // Add class for animation
        newTip.classList.add("slide-up");
        
        // Append tip at the bottom
        tipsContainer.appendChild(newTip);

        // Remove first tip after animation (to keep list small)
        if (tipsContainer.children.length > 4) {
            tipsContainer.removeChild(tipsContainer.firstChild);
        }

        // Move to next tip in the array
        tipIndex = (tipIndex + 1) % auctionTips.length;
    }

    // Show a new tip every 4 seconds
    setInterval(showNextTip, 4000);
});


async function fetchUpcomingAuctions() {
    try {
      const response = await fetch("http://localhost:5000/api/upcoming-auctions");
      const auctions = await response.json();
      
      const auctionList = document.getElementById("auction-list");
      auctionList.innerHTML = ""; // Clear existing list

      if (auctions.length === 0) {
        auctionList.innerHTML = "<li>No upcoming auctions</li>";
        return;
      }

      auctions.forEach(auction => {
        const auctionDate = new Date(auction.startDate).toLocaleDateString();
        const listItem = document.createElement("li");
        listItem.innerHTML = `📌 <strong>${auction.itemName}</strong> – ${auctionDate}`;
        auctionList.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error fetching auctions:", error);
      document.getElementById("auction-list").innerHTML = "<li>Failed to load auctions</li>";
    }
  }

  fetchUpcomingAuctions();

  



function setCurrentTime() {
  let startTime = document.getElementById("start-time");
  let endTime = document.getElementById("end-time");
  let startAmpm = document.getElementById("start-ampm");
  let endAmpm = document.getElementById("end-ampm");

  if (!startTime || !endTime || !startAmpm || !endAmpm) {
      console.warn("One or more time input fields are missing.");
      return; // Exit the function if elements are not found
  }

  let now = new Date();
  let hours = now.getHours() % 12 || 12;
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let ampm = now.getHours() >= 12 ? "PM" : "AM";
  let formattedTime = `${hours}:${minutes}`;

  startTime.value = formattedTime;
  endTime.value = formattedTime;
  startAmpm.value = ampm;
  endAmpm.value = ampm;
}

  
 
  
  



// for profile section on dashboard 
document.addEventListener("DOMContentLoaded", async function () {
    if (document.getElementById("profile-content")) {
        try {
            const response = await fetch("http://localhost:5000/profile", { credentials: "include" });
            const user = await response.json();
            
            if (response.ok) {
                document.getElementById("profile-name").textContent = user.name || "N/A";
                document.getElementById("profile-email").textContent = user.email || "N/A";
                document.getElementById("profile-mobile").textContent = user.mobile || "N/A";
                document.getElementById("profile-gender").textContent = user.gender || "N/A";

                // ✅ Convert DOB format (YYYY-MM-DD → DD-MM-YYYY)
                const dobElement = document.getElementById("profile-dob");
                if (user.dob) {
                    const formattedDOB = new Date(user.dob).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    });
                    dobElement.textContent = formattedDOB; // Example: "8 March 2007"
                } else {
                    dobElement.textContent = "N/A";
                }

                // ✅ Profile photo update
                const profilePhoto = document.getElementById("profile-photo");
                profilePhoto.src = user.profileImage
                    ? `http://localhost:5000/image/${user.profileImage}`
                    : "/img/default-avatar.png"; // Default avatar rakhein

            } else {
                Swal.fire({
                    title: "Error!",
                    text: user.message,
                    icon: "error",
                    confirmButtonText: "OK"
                });
                
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            Swal.fire({
                title: "Error!",
                text: "Could not load profile data.",
                icon: "error",
                confirmButtonText: "OK"
            });
            
        }
    }
});




// auction status fetch and showing on profile page of dashboard 
document.addEventListener("DOMContentLoaded", async function () {
  const auctionTableBody = document.getElementById("auctionData");

  try {
    const response = await fetch("http://localhost:5000/api/auction-status"); // Fetch auction data
    const auctions = await response.json();

    auctions.forEach((auction) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${auction.auctionId}</td>
        <td>${auction.itemName}</td>
        <td>Rs. ${auction.basePrice}</td>
        <td>${auction.sellerName}</td>
        <td>${auction.sellerEmail}</td>
        <td><img src="http://localhost:5000/image/${auction.itemImage}" alt="${auction.itemName}" width="80"></td>
        <td>${auction.status}</td>
      `;

      auctionTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching auction status:", error);
  }
});



  

// ye js code auction form ke liye he of create aucton on dashboard
document.getElementById("auction-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
        // Get user session details
        const response = await fetch("http://localhost:5000/profile", { credentials: "include" });
        const user = await response.json();

        if (!response.ok) {
            Swal.fire({
                title: "Error!",
                text: "You must be logged in to create an auction.",
                icon: "error",
                confirmButtonText: "Login Now"
            });
            
            return;
        }

        // Create FormData object for file upload
        const formData = new FormData();
        formData.append("sellerEmail", user.email);
        formData.append("itemName", document.getElementById("item-name").value);
        formData.append("itemImage", document.getElementById("item-image").files[0]); // Attach image file
        formData.append("basePrice", document.getElementById("base-price").value);
        formData.append("startDate", document.getElementById("start-date").value + " " + document.getElementById("start-time").value);
        formData.append("endDate", document.getElementById("end-date").value + " " + document.getElementById("end-time").value);
        formData.append("itemDetails", document.getElementById("item-details").value);
        formData.append("auctionType", document.querySelector("input[name='auction-type']:checked").value);
        formData.append("category", document.getElementById("category").value);

        formData.append("numBidders", document.getElementById("num-bidders").value);

        formData.append("sellerName", document.getElementById("first-name").value + " " + document.getElementById("last-name").value);
        

        formData.append("address", document.getElementById("address").value + ", " + document.getElementById("city").value + ", " + document.getElementById("state").value + " - " + document.getElementById("zip").value);
        formData.append("country", document.getElementById("country").value);
        formData.append("mobile", document.getElementById("phone").value);
        formData.append("education", document.getElementById("education").value);

        // Append bank details
        formData.append("holderName", document.getElementById("holderName2").value);
        formData.append("bankName", document.getElementById("bankName2").value);
        formData.append("ifscCode", document.getElementById("ifscCode2").value);
        formData.append("accountNumber", document.getElementById("accountNumber2").value);

        formData.append("upiId", document.getElementById("auctioneer-upi-id").value);

        // Send data using multipart/form-data
        const auctionResponse = await fetch("http://localhost:5000/create-auction", {
            method: "POST",
            credentials: "include",
            body: formData, // Automatically sets multipart/form-data
        });

        const result = await auctionResponse.json();
        if (auctionResponse.ok) {
            Swal.fire({
                title: "Success!",
                text: "Auction Created Successfully!",
                icon: "success",
                confirmButtonText: "OK"
            });
            
            document.getElementById("auction-form").reset();
        } else {Swal.fire({
            title: "Error!",
            text: "Error: " + result.message,
            icon: "error",
            confirmButtonText: "OK"
        });
        
        }
    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Oops!",
            text: "Something went wrong. Try again later.",
            icon: "error",
            confirmButtonText: "OK"
        });
        
    }
});











//card

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", async function () {
    // Select the main container where auction cards will be displayed
    const container = document.querySelector(".container");
    // Select the container for displaying bookmarked items
    const bookmarksContainer = document.querySelector(".bookmark-list");
    // Select the modal element for displaying auction details
    const modal = document.getElementById("bidModal");
    // Select the image element inside the modal
    const modalImage = document.getElementById("modalImage");
    // Select the title element inside the modal
    const modalTitle = document.getElementById("modalTitle");
    // Select the auction type element inside the modal
    const modalAuctionType = document.getElementById("modalAuctionType");
    // Select the price element inside the modal
    const modalPrice = document.getElementById("modalPrice");
    // Select the start date element inside the modal
    const modalStartDate = document.getElementById("modalStartDate");
    // Select the end date element inside the modal
    const modalEndDate = document.getElementById("modalEndDate");
    // Select the countdown timer element inside the modal
    const countdownElement = document.getElementById("countdown");
    // Select the current bid element inside the modal
    const currentBidElement = document.getElementById("currentBid");
    // Select the input field for entering bid amounts
    const bidInput = document.getElementById("bidAmount");
    // Select the button to place a bid
    const placeBidButton = document.getElementById("placeBid");
    // Select the close button for the modal
    const closeModal = document.querySelector(".close");
    // Select the element to display item details inside the modal
    const modalItemDetails = document.getElementById("modalItemDetails");
    // Select the table to display the list of bidders
    const biddersList = document.getElementById("biddersTable");

    // Variables for managing the countdown timer, current bid, and auction ID
    let countdownInterval;
    let currentBid = 0;
    let auctionId = null;
    // Load saved bookmarks from localStorage or initialize an empty array
    let savedItems = JSON.parse(localStorage.getItem("bookmarks")) || [];








    // Function to fetch and display auctions from the backend
    // Load & Display Active Auctions
async function loadAuctions() {
    try {
        const response = await fetch("http://localhost:5000/api/auctions");
        let auctions = await response.json();
        container.innerHTML = ""; // Clear previous cards

        const now = new Date().getTime();
        auctions.forEach((item) => {
            const endTime = new Date(item.endDate).getTime();

            if (now < endTime + 60000) { // Auction remains for 1 min after ending
                createAuctionCard(item);
            }
        });

        updateBookmarks();
    } catch (error) {
        console.error("Error fetching auctions:", error);
    }
}

// Create Auction Card
function createAuctionCard(item) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", item._id);
    card.setAttribute("data-title", item.itemName);
    card.setAttribute("data-img", `http://localhost:5000/image/${item.itemImage}`);
    card.setAttribute("data-price", item.basePrice);
    card.setAttribute("data-start", item.startDate);
    card.setAttribute("data-end", item.endDate);
    card.setAttribute("data-type", item.auctionType);
    card.setAttribute("data-details", item.itemDetails);
    card.setAttribute("data-seller", item.sellerEmail);
    card.setAttribute("data-numbidders", item.numBidders);

    const isSaved = savedItems.includes(item._id);


    // 🔥 Fetch applied bidders count from localStorage
    const appliedCount = parseInt(localStorage.getItem(`applied_count_${item._id}`) || "0", 10);
    
    // 🔥 Calculate remaining slots
    const remainingSlots = Math.max(item.numBidders - appliedCount, 0);

    card.innerHTML = `
        <i class="fa fa-bookmark save-icon ${isSaved ? 'saved' : ''}" data-id="${item._id}"></i>
        <img src="http://localhost:5000/image/${item.itemImage}" alt="${item.itemName}">
        <h2>${item.itemName}</h2>
        <p class="bid">Base Price: Rs. ${item.basePrice}</p>
        <p class="bidders-count">Remaining Slots: ${remainingSlots}</p> <!-- 🔥 Updated Text -->
        <p class="auction-type">Auction Type: <strong>${item.auctionType}</strong></p> <!-- 🔥 Auction Type Added -->
        <button class="bids">Bid Now</button>
    `;
    container.appendChild(card);
}

// Store Ended Auctions in Backend
async function storeEndedAuctions() {
    try {
        const response = await fetch("http://localhost:5000/api/auctions");
        let auctions = await response.json();
        const now = new Date().getTime();

        for (const item of auctions) {
            const endTime = new Date(item.endDate).getTime();
            if (now >= endTime) {
                // Check if it's already stored before calling API
                const checkResponse = await fetch(`/api/check-ended-auction/${item._id}`);
                const checkData = await checkResponse.json();

                if (!checkData.exists) {  // ✅ Only store if not already in deleteAuction
                    fetch(`/api/store-ended-auction/${item._id}`)
                        .then(response => response.json())
                        .then(data => console.log(`Stored auction ${item._id}:`, data.message))
                        .catch(error => console.error("Error storing auction:", error));
                }
            }
        }
    } catch (error) {
        console.error("Error fetching auctions for storage:", error);
    }
}


// Remove Auctions from UI after 1 Minute of Ending
async function removeEndedAuctions() {
    try {
        const now = new Date().getTime();
        document.querySelectorAll(".card").forEach(card => {
            const endTime = new Date(card.getAttribute("data-end")).getTime();
            if (now >= endTime + 60000) { // 1 min after end time
                card.remove();
                console.log(`Auction ${card.getAttribute("data-id")} removed from UI`);
            }
        });
    } catch (error) {
        console.error("Error removing ended auctions:", error);
    }
}

// Run Functions at Intervals
setInterval(() => {
    removeEndedAuctions();
}, 60000); // Every 1 minute

setInterval(() => {
    storeEndedAuctions();
}, 10000); // Every 10 seconds

// Initial Load
loadAuctions();






    // Function to update the bookmarks list in the DOM
    function updateBookmarks() {
        bookmarksContainer.innerHTML = ""; // Clear the bookmarks container
        // Loop through each bookmarked item and create a list item for it
        savedItems.forEach(id => {
            const card = container.querySelector(`.card[data-id='${id}']`);
            if (card) {
                // Get the image source, title, and base price from the card
                const imgSrc = card.querySelector("img").src;
                const title = card.querySelector("h2").textContent;
                const basePrice = card.querySelector(".bid").textContent;

                // Create a list item for the bookmarked item
                const listItem = document.createElement("li");
                listItem.classList.add("bookmark-item");
                listItem.innerHTML = `
                    <img src="${imgSrc}" alt="${title}" class="bookmark-img">
                    <div class="bookmark-info">
                        <span class="bookmark-title">${title}</span>
                        <p>${basePrice}</p>
                        <button class="remove-bookmark" data-id="${id}">Remove</button>
                    </div>
                `;
                // Append the list item to the bookmarks container
                bookmarksContainer.appendChild(listItem);
            }
        });

        // Save the updated bookmarks list to localStorage
        localStorage.setItem("bookmarks", JSON.stringify(savedItems));
    }













    // Event listener for clicks on the container (for "Bid Now" and bookmark buttons)
container.addEventListener("click", async function (event) {
    // "Apply Now" aur "Applied" button pe click hone par kuch bhi na ho
    if (event.target.classList.contains("apply-btn") || event.target.classList.contains("applied-btn")) {
        event.stopPropagation(); // Stops the event from propagating to the "Bid Now" logic
        return; // Stop further execution
    }

    // "Bid Now" button ke liye modal open kare
    if (event.target.classList.contains("bids")) {
        const card = event.target.closest(".card"); // Get the closest card element
        auctionId = card.getAttribute("data-id"); // Set the auction ID
        modalTitle.textContent = card.getAttribute("data-title"); // Set the modal title
        modalImage.src = card.getAttribute("data-img"); // Set the modal image
        modalPrice.textContent = "Base Price: Rs. " + card.getAttribute("data-price"); // Set the base price
        modalAuctionType.textContent = "Auction Type: " + card.getAttribute("data-type"); // Set the auction type
    
        // Parse and display the start and end dates
        const startDate = new Date(card.getAttribute("data-start"));
        const endDate = new Date(card.getAttribute("data-end"));
        modalStartDate.textContent = startDate.toLocaleString();
        modalEndDate.textContent = endDate.toLocaleString();
        modalItemDetails.textContent = "Item Details: " + card.getAttribute("data-details"); // Set item details
        document.getElementById("modalSeller").textContent = card.getAttribute("data-seller"); // Set seller email
        currentBid = parseFloat(card.getAttribute("data-price")); // Set the current bid
        updateBidDisplay(); // Update the bid display

      
        // ✅ Enable "Place Bid" Button for Both English & Dutch Auction
        placeBidButton.disabled = false;
        placeBidButton.style.backgroundColor = ""; 
        placeBidButton.style.cursor = "pointer";
    
        // ✅ Change Placeholder Based on Auction Type
        const auctionType = card.getAttribute("data-type").toLowerCase();
        bidInput.placeholder = auctionType === "dutch" ? "Enter a lower bid (Dutch Auction)" : "Enter a higher bid (English Auction)";
    
        // Clear any existing countdown interval
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        // Start a new countdown interval
        countdownInterval = setInterval(() => {
            updateCountdown(endDate); // Update the countdown every second
        }, 1000);
    
        await fetchBiddersList(); // Fetch the list of bidders
    
        modal.style.display = "flex"; // Display the modal

        checkIfUserIsSeller(); // ✅ Seller check karne ka function call karo
    }
    

   



    // ✅ Function to Check Auction Type
function getAuctionType(card) {
    const auctionType = card.getAttribute("data-type"); 

    if (!auctionType) {
        console.error("Auction type not found!");
        return null;
    }

    return auctionType.toLowerCase(); // "english" ya "dutch" return karega
}


// seller emailID place bid button disable 
async function checkIfUserIsSeller() {
    try {
        // 🔹 Logged-in user ka email fetch karo
        const response = await fetch("http://localhost:5000/profile", { credentials: "include" });
        const user = await response.json();

        if (!response.ok || !user.email) {
            console.error("Error fetching user profile:", user.message);
            return;
        }

        // 🔹 Seller email fetch karo (modal ke andar jo dikh raha hai)
        const sellerEmail = document.getElementById("modalSeller").textContent;

        // 🔹 Seller aur Logged-in user ka email match kare toh button disable karo
        if (user.email === sellerEmail) {
            placeBidButton.disabled = true;
            placeBidButton.style.backgroundColor = "#ccc"; // Disabled style
            placeBidButton.style.cursor = "not-allowed";
            Swal.fire({
                title: "Warning!",
                text: "Sellers cannot bid on their own auction!",
                icon: "warning",
                confirmButtonText: "OK"
            });
            
        } else {
            placeBidButton.disabled = false;
            placeBidButton.style.backgroundColor = ""; // Reset style
            placeBidButton.style.cursor = "pointer";
        }
    } catch (error) {
        console.error("Error checking seller:", error);
    }
}









// bookmark ka code he 
        // Handle clicks on the bookmark icon
        if (event.target.classList.contains("save-icon")) {
            const auctionId = event.target.getAttribute("data-id"); // Get the auction ID

            // Toggle the bookmark status
            if (savedItems.includes(auctionId)) {
                savedItems = savedItems.filter(id => id !== auctionId); // Remove from bookmarks
                event.target.classList.remove("saved"); // Remove the "saved" class
            } else {
                savedItems.push(auctionId); // Add to bookmarks
                event.target.classList.add("saved"); // Add the "saved" class
            }

            updateBookmarks(); // Update the bookmarks list
        }
    });

    // Event listener for clicks on the bookmarks container (for "Remove" buttons)
    bookmarksContainer.addEventListener("click", function (event) {
        // Handle clicks on the "Remove" button
        if (event.target.classList.contains("remove-bookmark")) {
            const auctionId = event.target.getAttribute("data-id"); // Get the auction ID
            savedItems = savedItems.filter(id => id !== auctionId); // Remove from bookmarks
            updateBookmarks(); // Update the bookmarks list
        }
    });









    // Function to fetch the list of bidders for the selected auction
    async function fetchBiddersList() {
        if (!auctionId) {
            console.error("Error: auctionId is undefined, cannot fetch bids!");
            return;
        }
        try {
            // ✅ Backend se bids fetch karo
            const response = await fetch(`http://localhost:5000/api/get-bids/${auctionId}`);
            if (!response.ok) throw new Error("Failed to fetch bids");
            const bids = await response.json();
            biddersList.innerHTML = ""; // ✅ Pehle purani list clear karo
            // ✅ Bidders ko modal ke andar show karo
            bids.forEach(bid => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${bid.bidderEmail.split("@")[0]}</td>
                    <td>${bid.bidderEmail}</td>
                    <td>Rs. ${bid.bidAmount}</td>
                    <td>${new Date(bid.bidTime).toLocaleString()}</td>
                `;
                biddersList.appendChild(row);
            });
            // ✅ Auction Type Check Karo
            const auctionType = modalAuctionType.textContent.toLowerCase().includes("dutch") ? "dutch" : "english";
            if (bids.length > 0) {
                if (auctionType === "dutch") {
                    currentBid = Math.min(...bids.map(bid => bid.bidAmount)); // ✅ Dutch Auction ke liye Lowest Bid
                } else {
                    currentBid = Math.max(...bids.map(bid => bid.bidAmount)); // ✅ English Auction ke liye Highest Bid
                }
                updateBidDisplay(currentBid); // ✅ Modal me Current Bid Update Karo
            }
            // ✅ Auction End Check Karo
            const auctionEndTime = document.getElementById("modalEndDate")?.textContent;
            if (!auctionEndTime) {
                console.warn("Auction end time not found in modal.");
                return;
            }
            const now = new Date().getTime();
            const endTime = new Date(auctionEndTime).getTime();
            if (now >= endTime) {
                document.querySelector(".bidders-list").style.display = "none";
                document.getElementById("winnerSection").style.display = "block";
                fetchWinnerDetails(); // ✅ Winner ka data fetch karo
            }
        } catch (error) {
            console.error("Error fetching bids:", error);
        }
    }
    




    
        // ✅ Function to fetch & display winner details
        async function fetchWinnerDetails() {
            try {
                const response = await fetch(`http://localhost:5000/api/auction-winner/${auctionId}`);
                if (!response.ok) throw new Error("Failed to fetch winner details");
        
                const data = await response.json();
                const winner = data.auction; // Extract auction details
                const winnersTable = document.getElementById("winnersTable");
                winnersTable.innerHTML = ""; // Clear previous data
        
                if (winner) {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${winner.auctionId}</td>
                        <td>${modalTitle.textContent}</td> <!-- Use item name from the modal -->
                        <td>${winner.winnerName}</td>
                        <td>${winner.winnerEmail}</td>
                        <td>Rs. ${winner.winningBid}</td>
                    `;
                    winnersTable.appendChild(row);
                }
            } catch (error) {
                console.error("Error fetching winner details:", error);
            }
        }
        
        
        // ✅ Ensure it runs every second for real-time updates
        setInterval(fetchBiddersList, 1000);
        




    // Function to update the countdown timer
    function updateCountdown(endDate) {
        const now = new Date().getTime(); // Get the current time
        const timeLeft = new Date(endDate).getTime() - now; // Calculate time left
    
        if (timeLeft <= 0) {
            countdownElement.textContent = "Auction Ended"; // Display "Auction Ended"
            clearInterval(countdownInterval); // Stop the countdown
            placeBidButton.disabled = true; // Disable the "Place Bid" button
            placeBidButton.style.backgroundColor = "#ccc"; // Change button style
            return;
        }
    
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
        // Update the countdown display
        countdownElement.textContent = `Time Left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    




    // Function to update the current bid display
    function updateBidDisplay(newBid, auctionType) {
        if (!newBid || isNaN(newBid)) {
            currentBidElement.textContent = "No bids placed yet.";
        } else {
            if (auctionType === "dutch") {
                // ✅ Dutch Auction: Display the lowest bid (correct fix)
                currentBidElement.textContent = `Current Bid: Rs. ${newBid}`;
            } else {
                // ✅ English Auction: Display the highest bid
                currentBidElement.textContent = `Current Bid: Rs. ${newBid}`;
            }
        }
    }
    
    
    
    






    // Event listener for the "Place Bid" button
    placeBidButton.addEventListener("click", async function () {
        const now = new Date().getTime();
        const auctionEndTime = new Date(modalEndDate.textContent).getTime();
    
        if (now >= auctionEndTime) {
            Swal.fire({
                title: "Auction Ended",
                text: "Bidding has ended for this auction!",
                icon: "info",
                confirmButtonText: "View Results"
            });
                        return;
        }
    
        const auctionType = modalAuctionType.textContent.toLowerCase().includes("dutch") ? "dutch" : "english";
        const newBid = parseFloat(bidInput.value);
    
        if (isNaN(newBid) || newBid <= 0) {
            Swal.fire({
                title: "Invalid Bid!",
                text: "Please enter a valid bid amount.",
                icon: "error",
                confirmButtonText: "Try Again"
            });
                        return;
        }
    
        // ✅ Dutch Auction: Multiple lower bids allowed
        if (auctionType === "dutch" && newBid >= currentBid) {
            Swal.fire({
                title: "Invalid Bid!",
                text: "English Auction: Your bid must be HIGHER than the current bid.",
                icon: "warning",
                confirmButtonText: "OK"
            });
                        return;
        }
        // ✅ English Auction: Higher Bids Required
        if (auctionType === "english" && newBid <= currentBid) {
            Swal.fire({
                title: "Invalid Bid!",
                text: "Dutch Auction: Your bid must be LOWER than the current bid.",
                icon: "warning",
                confirmButtonText: "OK"
            });
                        return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/api/place-bid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ auctionId, bidAmount: newBid, auctionType })  // ✅ Send auction type
            });
    
            const result = await response.json();
    
            if (!response.ok) throw new Error(result.message || "Failed to place bid");
    
            // ✅ Update Current Bid and Refresh Bidders List
            currentBid = auctionType === "dutch" ? newBid : Math.max(currentBid, newBid);
            
            // ✅ Update Display & Refresh Bid List
            updateBidDisplay(currentBid, auctionType);
            fetchBiddersList();
            bidInput.value = "";
    
            Swal.fire({
                title: "Bid Placed!",
                text: "Your bid has been placed successfully!",
                icon: "success",
                confirmButtonText: "OK"
            });
                    } catch (error) {
            console.error("Error placing bid:", error);
        }
    });
    
    // Event listener for the close button
    closeModal.addEventListener("click", function () {
        modal.style.display = "none"; // Hide the modal
        clearInterval(countdownInterval); // Clear the countdown interval
    });
    
    loadAuctions(); // Load auctions when the page loads
});    







// auctions button - apply now to applied and then bid now

async function fetchAppliedStatus(auctionId) {
    try {
        const response = await fetch(`/applied-status?auctionId=${auctionId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching applied status:", error);
        return { success: false };
    }
}

async function applyForAuction(auctionId, numBidders) {
    Swal.fire({
        title: "Apply for Auction?",
        text: `Max Bidders Allowed: ${numBidders}\n\nDo you want to apply?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Apply!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            applyForAuction(auctionId);
        }
    });
    

    try {
        const response = await fetch(`/apply-now?auctionId=${auctionId}`);
        const data = await response.json();

        if (data.success) {
            Swal.fire({
                title: "Applied!",
                text: "Successfully applied for the auction!",
                icon: "success",
                confirmButtonText: "OK"
            });
            
            updateAuctionButtons();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error applying for auction:", error);
    }
}

async function updateAuctionButtons() {
    const now = Date.now();

    document.querySelectorAll(".card").forEach(async (card) => {
        const startDate = new Date(card.getAttribute("data-start")).getTime();
        const endDate = new Date(card.getAttribute("data-end")).getTime();
        const button = card.querySelector(".bids");
        const slotDisplay = card.querySelector(".bidders-count");
        const auctionId = card.getAttribute("data-id");
        const numBidders = parseInt(card.getAttribute("data-numbidders"), 10);
        const sellerEmail = card.getAttribute("data-seller");

        const status = await fetchAppliedStatus(auctionId);
        if (!status.success) return;

        let { appliedCount, remainingSlots, isApplied, loggedInEmail } = status;
        slotDisplay.textContent = remainingSlots > 0 ? `Remaining Slots: ${remainingSlots}` : "Slots Full";

        if (now < startDate) {
            if (isApplied) {
                button.textContent = "Applied";
                button.classList.add("applied-btn");
                button.onclick = null;
            } else if (appliedCount >= numBidders) {
                button.textContent = "Applied";
                button.classList.add("applied-btn");
                button.onclick = null;
            } else {
                button.textContent = "Apply Now";
                button.classList.add("apply-btn");
                button.onclick = () => applyForAuction(auctionId, numBidders);
            }
        } else if (now >= startDate && now < endDate) {
            if (isApplied) {
                button.textContent = "Bid Now";
                button.classList.remove("apply-btn", "applied-btn", "disabled-btn");
                button.onclick = () => openBidModal(auctionId);
            } else {
                button.textContent = "You're Not Eligible";
                button.classList.add("not-eligible-btn");
               button.onclick = (event) => {
    event.stopPropagation(); // ✅ Stop event bubbling
    Swal.fire({
        title: "Access Denied!",
        text: "Sellers and non-appliers cannot bid. Apply before bidding!",
        icon: "warning",
        confirmButtonText: "OK"
    });
    };

            }
        } else {
            button.textContent = "Bid Closed | Result";
            button.classList.remove("disabled-btn");
            button.classList.add("closed-btn");
            button.onclick = () => openResultModal(auctionId);
        }
    });
}

document.addEventListener("DOMContentLoaded", updateAuctionButtons);
setInterval(updateAuctionButtons, 1000);

// 🔥 Fetch logged-in user email along with applied status
async function fetchAppliedStatus(auctionId) {
    try {
        const response = await fetch(`/applied-status?auctionId=${auctionId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching applied status:", error);
        return { success: false };
    }
}

document.addEventListener("DOMContentLoaded", updateAuctionButtons);
setInterval(updateAuctionButtons, 1000);



















async function loadWonItems() {
    try {
        const userEmail = "user@example.com"; // Replace dynamically
        const response = await fetch(`/api/my-won-items?email=${userEmail}`);
        const wonItems = await response.json();

        const cartItemsContainer = document.getElementById("cart-items");

        if (wonItems.length === 0) {
            cartItemsContainer.innerHTML = `<i class="fa-solid fa-box-open"></i> No won items yet.`;
            return;
        }

        cartItemsContainer.innerHTML = ""; // ✅ Clear previous content

        wonItems.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");

            itemDiv.innerHTML = `
            <img src="http://localhost:5000/image/${item.itemImage}" alt="Item Image" class="item-image"/>
        
            <hr class="section-divider">
        
            <h3>${item.itemName}</h3>
            <p><strong>Details:</strong> ${item.itemDetails}</p>
            <p><strong>Category:</strong> ${item.category}</p>
        
            <hr class="section-divider">
        
            <h4>Seller Info</h4>
            <p><strong>Email:</strong> ${item.sellerEmail}</p>
            <p><strong>Name:</strong> ${item.sellerName}</p>
            <p><strong>Address:</strong> ${item.address}, ${item.country}</p>
            <p><strong>Mobile:</strong> ${item.mobile}</p>
        
            <hr class="section-divider">
        
            <h4>Winner Info</h4>
            <p><strong>Name:</strong> ${item.winnerName}</p>
            <p><strong>Email:</strong> ${item.winnerEmail}</p>
            <p><strong>Winning Bid:</strong> $${item.winningBid}</p>
        
            <hr class="section-divider">
        
            <h4>Seller Education</h4>
            <p><strong>Qualification:</strong> ${item.education}</p>
        
            <hr class="section-divider">
        
            <h4>Bank Details</h4>
            <p><strong>Holder Name:</strong> ${item.holderName || "N/A"}</p>
            <p><strong>Bank Name:</strong> ${item.bankName || "N/A"}</p>
            <p><strong>IFSC Code:</strong> ${item.ifscCode || "N/A"}</p>
            <p><strong>Account Number:</strong> ${item.accountNumber || "N/A"}</p>
            <p><strong>UPI ID:</strong> ${item.upiId || "N/A"}</p>
        
            <a href="javascript:void(0);" class="pay-now-btn" onclick='payNow("${item.auctionId}")'>Pay Now</a>
        `;

            cartItemsContainer.appendChild(itemDiv);
        });
    } catch (error) {
        console.error("Error loading won items:", error);
        document.getElementById("cart-items").innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> Error loading items.`;
    }
}

// ✅ Load won items when clicking on "cart-items"
document.getElementById("cart-items").addEventListener("click", loadWonItems);

// ✅ Pay Now function redirects to payment page
function payNow(auctionId) {
    window.location.href = `payment.html?auctionId=${auctionId}`;
}





function logoutUser() {
    // Send a request to destroy the session
    fetch('/logout', { method: 'GET' })
        .then(response => {
            if (response.ok) {
                // Clear session storage to prevent back button access
                sessionStorage.clear();
                localStorage.clear();

                // Redirect to login page
                window.location.href = '/login.html';
            }
        })
        .catch(error => console.error('Logout failed:', error));
}

// Prevent back button after logout
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
};
