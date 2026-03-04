document.addEventListener("DOMContentLoaded", function () {

    /* ================= LOGIN ================= */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = loginForm.querySelector("input[type='text']").value.trim();
            const password = loginForm.querySelector("input[type='password']").value.trim();

            if (username === "" || password === "") {
                alert("Please fill in all fields.");
                return;
            }

            // Demo Login Credentials
            if (username === "admin" && password === "1234") {

                localStorage.setItem("easymartUser", username);

                alert("Login successful!");
                window.location.href = "landing.html";

            } else {
                alert("Invalid username or password.");
            }
        });
    }


    /* ================= PAGE PROTECTION ================= */

    const currentPage = window.location.pathname.split("/").pop();
    const protectedPages = ["landing.html"];

    if (protectedPages.includes(currentPage)) {
        const user = localStorage.getItem("easymartUser");
        if (!user) {
            window.location.href = "login.html";
        }
    }


    /* ================= SHOW USER ================= */

    const userDisplay = document.getElementById("userDisplay");
    const user = localStorage.getItem("easymartUser");

    if (userDisplay && user) {
        userDisplay.textContent = "Welcome, " + user;
    }


    /* ================= LOGOUT ================= */

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("easymartUser");
            window.location.href = "login.html";
        });
    }

});