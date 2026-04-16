let selectedMethod = "";

function selectPayment(method, element) {
    selectedMethod = method;

    // Remove active class
    document.querySelectorAll(".payment-option")
        .forEach(el => el.classList.remove("active"));

    // Add active class
    element.classList.add("active");

    document.getElementById(method).checked = true;

    let details = document.getElementById("payment-details");

    if (method === "bkash" || method === "nagad") {
        details.innerHTML = `
            <input type="text" id="mobile" placeholder="Enter Mobile Number">
            <input type="text" id="trx" placeholder="Transaction ID">
        `;
    }
    else if (method === "card") {
        details.innerHTML = `
            <input type="text" id="cardnum" placeholder="Card Number">
            <input type="text" id="expiry" placeholder="Expiry (MM/YY)">
            <input type="text" id="cvv" placeholder="CVV">
        `;
    }
    else {
        details.innerHTML = "";
    }
}

function confirmOrder() {
    let msg = document.getElementById("message");

    if (selectedMethod === "") {
        msg.style.color = "red";
        msg.innerText = "⚠ Select a payment method!";
        return;
    }

    // Validation
    if (selectedMethod === "bkash" || selectedMethod === "nagad") {
        let mobile = document.getElementById("mobile")?.value;
        let trx = document.getElementById("trx")?.value;

        if (!mobile || !trx) {
            msg.style.color = "red";
            msg.innerText = "⚠ Fill all payment details!";
            return;
        }
    }

    if (selectedMethod === "card") {
        let card = document.getElementById("cardnum")?.value;
        let exp = document.getElementById("expiry")?.value;
        let cvv = document.getElementById("cvv")?.value;

        if (!card || !exp || !cvv) {
            msg.style.color = "red";
            msg.innerText = "⚠ Fill card details!";
            return;
        }
    }

    msg.style.color = "green";
    msg.innerText = "✔ Payment Successful! Redirecting...";

    setTimeout(() => {
        window.location.href = "success.html"; // optional next page
    }, 2000);
}