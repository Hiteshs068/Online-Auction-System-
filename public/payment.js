document.addEventListener("DOMContentLoaded", function () {
    const paymentMethod = document.getElementById("payment-method");
    const cardForm = document.getElementById("card-payment-form");
    const upiForm = document.getElementById("upi-payment-form");
    const netBankingForm = document.getElementById("netbanking-form");
    const paypalForm = document.getElementById("paypal-form");
    const upiIdInput = document.getElementById("upi-id");
    const generateQRBtn = document.getElementById("generate-qr");
    const qrCodeDiv = document.getElementById("qr-code");
    const payNowBtn = document.getElementById("pay-now-btn");

    let qrCode = null;

    // Toggle form visibility based on selected payment method
    function toggleForms(selectedMethod) {
        cardForm.style.display = selectedMethod === "card" ? "block" : "none";
        upiForm.style.display = selectedMethod === "upi" ? "block" : "none";
        netBankingForm.style.display = selectedMethod === "netbanking" ? "block" : "none";
        paypalForm.style.display = selectedMethod === "paypal" ? "block" : "none";
        qrCodeDiv.innerHTML = ""; // Clear QR code when switching
    }

    paymentMethod.addEventListener("change", function () {
        toggleForms(this.value);
    });

    // Generate QR Code for UPI Payment
    generateQRBtn.addEventListener("click", function () {
        const upiId = upiIdInput.value.trim();
        if (upiId === "") {
            Swal.fire({
                title: "Invalid UPI ID!",
                text: "Please enter a valid UPI ID.",
                icon: "warning",
                confirmButtonText: "OK"
            });
            
            return;
        }

        const upiPaymentUrl = `upi://pay?pa=${upiId}&pn=Auction Payment&am=&cu=INR`;

        qrCodeDiv.innerHTML = ""; // Clear previous QR Code
        qrCode = new QRCode(qrCodeDiv, {
            text: upiPaymentUrl,
            width: 200,
            height: 200
        });

        Swal.fire({
            title: "QR Code Generated!",
            text: "Scan the QR code to proceed with payment.",
            icon: "success",
            confirmButtonText: "OK"
        });
        
    });

    // Handle Payment Submission & Redirection
    payNowBtn.addEventListener("click", function () {
        const selectedMethod = paymentMethod.value;

        if (selectedMethod === "card") {
            const name = document.getElementById("name").value;
            const cardNumber = document.getElementById("card-number").value;
            const expiry = document.getElementById("expiry").value;
            const cvv = document.getElementById("cvv").value;

            if (name === "" || cardNumber === "" || expiry === "" || cvv === "") {
                Swal.fire({
                    title: "Incomplete Details!",
                    text: "Please fill in all card details!",
                    icon: "warning",
                    confirmButtonText: "OK"
                });
                
                return;
            }

            alert("Redirecting to card payment gateway...");
            window.location.href = "https://www.visa.com"; // Example: Redirect to Visa
        } 
        else if (selectedMethod === "upi") {
            const upiId = upiIdInput.value.trim();
            if (upiId === "") {
                Swal.fire({
                    title: "Invalid UPI ID!",
                    text: "Please enter your UPI ID!",
                    icon: "warning",
                    confirmButtonText: "OK"
                });
                ;
                return;
            }

            Swal.fire({
                title: "Redirecting...",
                text: "You are being redirected to the UPI payment gateway.",
                icon: "info",
                confirmButtonText: "Proceed"
            }).then(() => {
                window.location.href = `upi://pay?pa=${upiId}&pn=Auction Payment&am=&cu=INR`;
            });
            
            
        } 
        else if (selectedMethod === "netbanking") {
            const bank = document.getElementById("bank").value;

            const bankLinks = {
                "hdfc": "https://netbanking.hdfcbank.com",
                "sbi": "https://retail.onlinesbi.sbi",
                "icici": "https://www.icicibank.com",
                "axis": "https://www.axisbank.com"
            };

            if (bankLinks[bank]) {
                Swal.fire({
                    title: "Redirecting...",
                    text: `You are being redirected to ${bank.toUpperCase()} Bank.`,
                    icon: "info",
                    confirmButtonText: "Proceed"
                }).then(() => {
                    window.location.href = bankLinks[bank];
                });
                
                window.location.href = bankLinks[bank];
            } else {
                Swal.fire({
                    title: "Invalid Selection!",
                    text: "Please select a valid bank.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                
            }
        } 
        else if (selectedMethod === "paypal") {
            const paypalEmail = document.getElementById("paypal-email").value;
            if (paypalEmail === "") {
                Swal.fire({
                    title: "Invalid Email!",
                    text: "Please enter your PayPal email!",
                    icon: "warning",
                    confirmButtonText: "OK"
                });
                
                return;
            }

            Swal.fire({
                title: "Redirecting...",
                text: "You are being redirected to PayPal.",
                icon: "info",
                confirmButtonText: "Proceed"
            }).then(() => {
                window.location.href = "https://www.paypal.com";
            });
            
            
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const paymentMethod = document.getElementById("payment-method");
    const cardForm = document.getElementById("card-payment-form");
    const upiForm = document.getElementById("upi-payment-form");
    const netBankingForm = document.getElementById("netbanking-form");
    const paypalForm = document.getElementById("paypal-form");
    const codForm = document.getElementById("cod-form");

    paymentMethod.addEventListener("change", function () {
        const selectedMethod = paymentMethod.value;

        // Hide all payment forms
        cardForm.style.display = "none";
        upiForm.style.display = "none";
        netBankingForm.style.display = "none";
        paypalForm.style.display = "none";
        codForm.style.display = "none";

        // Show the selected payment form
        if (selectedMethod === "card") {
            cardForm.style.display = "block";
        } else if (selectedMethod === "upi") {
            upiForm.style.display = "block";
        } else if (selectedMethod === "netbanking") {
            netBankingForm.style.display = "block";
        } else if (selectedMethod === "paypal") {
            paypalForm.style.display = "block";
        } else if (selectedMethod === "cod") {
            codForm.style.display = "block";
        }
    });

    document.getElementById("pay-now-btn").addEventListener("click", function () {
        const selectedMethod = paymentMethod.value;

        if (selectedMethod === "cod") {
            const fullName = document.getElementById("full-name").value.trim();
            const phoneNumber = document.getElementById("phone-number").value.trim();
            const address = document.getElementById("address").value.trim();
            const city = document.getElementById("city").value.trim();
            const zipCode = document.getElementById("zipcode").value.trim();
            const country = document.getElementById("country").value.trim();

            if (!fullName || !phoneNumber || !address || !city || !zipCode || !country) {
                Swal.fire({
                    title: "Incomplete Details!",
                    text: "Please fill in all required details for COD.",
                    icon: "warning",
                    confirmButtonText: "OK"
                });
                
                return;
            }

            Swal.fire({
                title: "Order Placed!",
                text: "Your COD order has been placed successfully.",
                icon: "success",
                confirmButtonText: "OK"
            });
            
        } else {
            Swal.fire({
                title: "Processing Payment...",
                text: "Your payment is being processed.",
                icon: "info",
                confirmButtonText: "OK"
            });
            
        }
    });
});
