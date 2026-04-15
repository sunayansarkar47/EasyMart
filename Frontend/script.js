//Home page animation
if (window.location.pathname.endsWith("index.html")) {
    setTimeout(() => {
        window.location.href = "landing.html";
    }, 3000);
}
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
/* ========== INDEX AUTO REDIRECT ========== */

document.addEventListener("DOMContentLoaded", function () {

    const splash = document.querySelector(".splash");

    if (splash) {
        splash.addEventListener("animationend", function () {
            window.location.href = "landing.html";
        });
    }

});





//Shopkeeper Dashboard page js


let products = [
  {
    name: "Apple",
    price: 18,
    cost: 12,
    qty: 10,
    img: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg"
  },
  {
    name: "Cabbage",
    price: 15,
    cost: 10,
    qty: 8,
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Cabbage_and_cross_section_on_white.jpg"
  }
];

const list = document.getElementById("productList");
const totalProfitEl = document.getElementById("totalProfit");

// ===== RENDER PRODUCTS =====
function render() {
  list.innerHTML = "";
  let totalProfit = 0;

  products.forEach((p, index) => {

    let profit = (p.price - p.cost) * p.qty;
    totalProfit += profit;

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.img}">

      <input value="${p.name}" class="name">

      <input type="number" class="price" value="${p.price}" placeholder="Price">
      <input type="number" class="cost" value="${p.cost}" placeholder="Cost">
      <input type="number" class="qty" value="${p.qty}" placeholder="Qty">

      <p><b>Profit:</b> $${profit}</p>

      <button class="btn save">Save</button>
      <button class="btn delete">Delete</button>
    `;

    // DELETE
    card.querySelector(".delete").onclick = () => {
      products.splice(index, 1);
      render();
    };

    // SAVE UPDATE
    card.querySelector(".save").onclick = () => {
      products[index].name = card.querySelector(".name").value;
      products[index].price = +card.querySelector(".price").value;
      products[index].cost = +card.querySelector(".cost").value;
      products[index].qty = +card.querySelector(".qty").value;
      render();
    };

    list.appendChild(card);
  });

  totalProfitEl.innerText = totalProfit;
}

// ===== ADD PRODUCT =====
document.getElementById("addBtn").onclick = () => {
  products.push({
    name: "New Product",
    price: 10,
    cost: 5,
    qty: 1,
    img: "https://via.placeholder.com/150"
  });

  render();
};

render();
/* Logout */
document.addEventListener("DOMContentLoaded", function () {

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault(); // stop default link behavior

            localStorage.removeItem("easymartUser");

            window.location.href = "login.html";
        });
    }

});