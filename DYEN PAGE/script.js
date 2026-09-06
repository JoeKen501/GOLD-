/* =====================================================
   AURUMCORE GOLD
   JavaScript
===================================================== */


"use strict";


/* =====================================================
   GLOBAL DATA
===================================================== */

let goldPrice = 2486.40;

let orders = [
    {
        id: "#AC-24819",
        date: "Sep 02, 2026",
        asset: "Gold Bar",
        quantity: 25,
        value: 62160,
        status: "Completed"
    },

    {
        id: "#AC-24792",
        date: "Aug 29, 2026",
        asset: "Gold Coins",
        quantity: 10,
        value: 24864,
        status: "Processing"
    },

    {
        id: "#AC-24751",
        date: "Aug 24, 2026",
        asset: "Gold Bar",
        quantity: 50,
        value: 124320,
        status: "Shipped"
    }
];


let portfolio = {
    value: 842640,
    goldOz: 338.78,
    cash: 48920
};


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeChart();

    initializePeriods();

    initializeOrderCalculator();

    initializeContactForm();

    initializeNavigation();

    simulateMarket();

});


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

function toggleMenu() {

    const navbar = document.querySelector(".navbar");

    navbar.classList.toggle("mobile-open");

}


function initializeNavigation() {

    document.querySelectorAll(".nav-links a").forEach(link => {

        link.addEventListener("click", () => {

            document
                .querySelector(".navbar")
                .classList.remove("mobile-open");

        });

    });

}


/* =====================================================
   SCROLL
===================================================== */

function scrollToSection(id) {

    const section = document.getElementById(id);

    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth"
    });

}


/* =====================================================
   LOGIN MODAL
===================================================== */

function openLogin() {

    const modal = document.getElementById("loginModal");

    modal.classList.add("show");

    document.body.classList.add("modal-open");

}


function closeLogin() {

    const modal = document.getElementById("loginModal");

    modal.classList.remove("show");

    document.body.classList.remove("modal-open");

}


function closeModalOutside(event) {

    if (event.target.id === "loginModal") {
        closeLogin();
    }

}


function login(event) {

    event.preventDefault();

    closeLogin();

    showToast("Welcome back to AurumCore.");

    setTimeout(() => {

        openDashboard();

    }, 500);

}


/* =====================================================
   DASHBOARD
===================================================== */

function openDashboard() {

    scrollToSection("dashboard");

}


function viewAllOrders() {

    showToast("All available orders are displayed.");

}


/* =====================================================
   ORDER MODAL
===================================================== */

function openOrderModal() {

    const modal = document.getElementById("orderModal");

    modal.classList.add("show");

    document.body.classList.add("modal-open");

    updateOrderValue();

}


function closeOrderModal() {

    const modal = document.getElementById("orderModal");

    modal.classList.remove("show");

    document.body.classList.remove("modal-open");

}


function closeOrderOutside(event) {

    if (event.target.id === "orderModal") {

        closeOrderModal();

    }

}


/* =====================================================
   ORDER CALCULATOR
===================================================== */

function initializeOrderCalculator() {

    const quantity =
        document.getElementById("orderQuantity");

    const asset =
        document.getElementById("orderAsset");


    if (quantity) {

        quantity.addEventListener(
            "input",
            updateOrderValue
        );

    }


    if (asset) {

        asset.addEventListener(
            "change",
            updateOrderValue
        );

    }

}


function getAssetPrice(asset) {

    switch (asset) {

        case "Gold Bar":
            return goldPrice;

        case "Gold Coins":
            return goldPrice * 1.025;

        case "Silver":
            return 29.18;

        default:
            return goldPrice;

    }

}


function updateOrderValue() {

    const quantity =
        Number(
            document.getElementById("orderQuantity")?.value || 0
        );


    const asset =
        document.getElementById("orderAsset")?.value ||
        "Gold Bar";


    const price = getAssetPrice(asset);

    const total = quantity * price;


    const output =
        document.getElementById("orderValue");


    if (output) {

        output.textContent =
            formatCurrency(total);

    }

}


/* =====================================================
   CREATE ORDER
===================================================== */

function createOrder(event) {

    event.preventDefault();


    const asset =
        document.getElementById("orderAsset").value;


    const quantity =
        Number(
            document.getElementById("orderQuantity").value
        );


    if (!quantity || quantity <= 0) {

        showToast("Enter a valid quantity.");

        return;

    }


    const value =
        quantity * getAssetPrice(asset);


    const newOrder = {

        id:
            "#AC-" +
            Math.floor(
                10000 +
                Math.random() * 89999
            ),

        date:
            getCurrentDate(),

        asset,

        quantity,

        value,

        status: "Processing"

    };


    orders.unshift(newOrder);


    renderOrders();


    if (asset.includes("Gold")) {

        portfolio.goldOz += quantity;

        portfolio.value += value;

        portfolio.cash -= value;

    }


    updateDashboard();


    closeOrderModal();


    showToast(
        `${newOrder.id} created successfully.`
    );

}


function renderOrders() {

    const table =
        document.getElementById("ordersTable");


    if (!table) return;


    table.innerHTML = "";


    orders.slice(0, 5).forEach(order => {

        const row =
            document.createElement("tr");


        const statusClass =
            getStatusClass(order.status);


        row.innerHTML = `

            <td>

                <strong>${order.id}</strong>

                <small>${order.date}</small>

            </td>


            <td>
                ${order.asset}
            </td>


            <td>
                ${order.quantity} oz
            </td>


            <td>
                ${formatCurrency(order.value)}
            </td>


            <td>

                <span class="badge ${statusClass}">
                    ${order.status}
                </span>

            </td>

        `;


        table.appendChild(row);

    });

}


function getStatusClass(status) {

    switch (status) {

        case "Completed":
            return "completed";

        case "Shipped":
            return "shipped";

        default:
            return "processing";

    }

}


/* =====================================================
   DASHBOARD UPDATE
===================================================== */

function updateDashboard() {

    const portfolioValue =
        document.getElementById("portfolioValue");


    const goldHoldings =
        document.getElementById("goldHoldings");


    const cashBalance =
        document.getElementById("cashBalance");


    if (portfolioValue) {

        portfolioValue.textContent =
            formatCurrency(portfolio.value);

    }


    if (goldHoldings) {

        goldHoldings.textContent =
            portfolio.goldOz.toFixed(2) + " oz";

    }


    if (cashBalance) {

        cashBalance.textContent =
            formatCurrency(
                Math.max(0, portfolio.cash)
            );

    }

}


/* =====================================================
   MARKET SIMULATION
===================================================== */

function simulateMarket() {

    setInterval(() => {

        const movement =
            (Math.random() - 0.48) * 2.5;


        goldPrice += movement;


        goldPrice =
            Math.max(
                2300,
                Math.min(
                    2700,
                    goldPrice
                )
            );


        updateMarketPrice();

        addChartPoint(goldPrice);

    }, 5000);

}


function updateMarketPrice() {

    const ticker =
        document.getElementById("goldPrice");


    const market =
        document.getElementById(
            "marketGoldPrice"
        );


    const formatted =
        formatCurrency(goldPrice);


    if (ticker) {

        ticker.textContent =
            formatted;

    }


    if (market) {

        market.textContent =
            formatted;

    }


    updateOrderValue();

}


/* =====================================================
   CHART
===================================================== */

let chartData = [
    2422,
    2430,
    2418,
    2441,
    2452,
    2446,
    2462,
    2458,
    2470,
    2464,
    2479,
    2468,
    2482,
    2476,
    2486
];


function initializeChart() {

    drawChart(chartData);

}


function drawChart(data) {

    const line =
        document.getElementById("chartLine");


    const area =
        document.getElementById("chartArea");


    if (!line || !area) return;


    const width = 1000;

    const height = 300;

    const padding = 10;


    const min =
        Math.min(...data) - 5;


    const max =
        Math.max(...data) + 5;


    const points =
        data.map((value, index) => {

            const x =
                padding +
                (
                    index /
                    (data.length - 1)
                ) *
                (width - padding * 2);


            const y =
                height -
                (
                    (
                        value - min
                    ) /
                    (
                        max - min
                    )
                ) *
                (height - padding * 2);


            return `${x},${y}`;

        });


    const path =
        "M " + points.join(" L ");


    line.setAttribute(
        "d",
        path
    );


    const areaPath =
        path +
        ` L ${width - padding},${height} L ${padding},${height} Z`;


    area.setAttribute(
        "d",
        areaPath
    );

}


function addChartPoint(price) {

    chartData.push(price);

    if (chartData.length > 25) {

        chartData.shift();

    }

    drawChart(chartData);

}


/* =====================================================
   CHART PERIODS
===================================================== */

function initializePeriods() {

    document
        .querySelectorAll(".period")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".period")
                        .forEach(btn =>
                            btn.classList.remove("active")
                        );


                    button.classList.add("active");


                    changeChartPeriod(
                        button.dataset.period
                    );

                }
            );

        });

}


function changeChartPeriod(period) {

    let multiplier = 1;


    switch (period) {

        case "1W":
            multiplier = 0.7;
            break;

        case "1M":
            multiplier = 1.2;
            break;

        case "1Y":
            multiplier = 1.8;
            break;

        default:
            multiplier = 1;

    }


    const base = goldPrice;


    const newData =
        Array.from(
            { length: 20 },
            (_, index) => {

                const wave =
                    Math.sin(index / 2) *
                    12 *
                    multiplier;


                const random =
                    (
                        Math.random() -
                        .5
                    ) *
                    12;


                return (
                    base -
                    35 +
                    index * 2 +
                    wave +
                    random
                );

            }
        );


    drawChart(newData);

}


/* =====================================================
   CONTACT FORM
===================================================== */

function initializeContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        submitContactForm
    );

}


function submitContactForm(event) {

    event.preventDefault();


    const firstName =
        document.getElementById(
            "firstName"
        ).value;


    const formMessage =
        document.getElementById(
            "formMessage"
        );


    formMessage.textContent =
        `Thank you ${firstName}. Your enquiry has been received.`;

    formMessage.style.color =
        "#27865b";


    document
        .getElementById("contactForm")
        .reset();


    showToast(
        "Your enquiry was sent successfully."
    );

}


/* =====================================================
   UTILITIES
===================================================== */

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }
    ).format(value);

}


function getCurrentDate() {

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "2-digit",
            year: "numeric"
        }
    ).format(new Date());

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById("toast");


    const text =
        toast.querySelector("span");


    text.textContent = message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);

}


/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeLogin();

            closeOrderModal();

        }

    }
);