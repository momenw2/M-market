function retrieveToken() {
    return fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
        headers: {
            'Accept': 'text/plain'
        }
    })
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Failed to retrieve token');
            }
        })
        .then(function (token) {
            localStorage.setItem('token', JSON.stringify(token));
            return token;
        })
        .catch(function (error) {
            console.log('Error retrieving token:', error);
        });
}

async function getToken() {
    let token = JSON.parse(localStorage.getItem('token'));

    if (!token) {
        token = await retrieveToken();
    }

    return token;
}

function fetchOrderDetails(orderId) {
    var token = JSON.parse(localStorage.getItem('token'));

    if (token) {
        var apiUrl = "https://food-delivery.kreosoft.ru/api/order/" + orderId;

        fetch(apiUrl, {
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch order details");
                }
            })
            .then(function (orderDetails) {
                displayOrderDetails(orderDetails);
            })
            .catch(function (error) {
                console.log("Error fetching order details:", error);
            });
    } else {
        console.log("No authentication token found.");
    }
}


function displayOrderDetails(orderDetails) {
    var orderInfoDiv = document.getElementById("orderInfo");
    orderInfoDiv.innerHTML = "";

    // Order ID
    var orderId = document.createElement("div");
    orderId.textContent = "Order ID: " + orderDetails.id;
    orderInfoDiv.appendChild(orderId);

    // Delivery Time
    var deliveryTime = document.createElement("div");
    deliveryTime.textContent = "Delivery Time: " + orderDetails.deliveryTime;
    orderInfoDiv.appendChild(deliveryTime);

    // Order Time
    var orderTime = document.createElement("div");
    orderTime.textContent = "Order Time: " + orderDetails.orderTime;
    orderInfoDiv.appendChild(orderTime);

    // Order Status
    var orderStatus = document.createElement("div");
    orderStatus.textContent = "Status: " + orderDetails.status;
    orderInfoDiv.appendChild(orderStatus);

    // Total Price
    var totalPrice = document.createElement("div");
    totalPrice.textContent = "Total Price: " + orderDetails.price;
    orderInfoDiv.appendChild(totalPrice);

    // Address
    var address = document.createElement("div");
    address.textContent = "Address: " + orderDetails.address;
    orderInfoDiv.appendChild(address);

    // Dishes
    var dishesTitle = document.createElement("h2");
    dishesTitle.textContent = "Dishes";
    orderInfoDiv.appendChild(dishesTitle);

    var dishesList = document.createElement("ul");
    orderDetails.dishes.forEach(function (dish) {
        var dishItem = document.createElement("li");

        var dishName = document.createElement("div");
        dishName.textContent = "Name: " + dish.name;
        dishItem.appendChild(dishName);

        var dishPrice = document.createElement("div");
        dishPrice.textContent = "Price: " + dish.price;
        dishItem.appendChild(dishPrice);

        var dishTotalPrice = document.createElement("div");
        dishTotalPrice.textContent = "Total Price: " + dish.totalPrice;
        dishItem.appendChild(dishTotalPrice);

        var dishAmount = document.createElement("div");
        dishAmount.textContent = "Amount: " + dish.amount;
        dishItem.appendChild(dishAmount);

        var dishImage = document.createElement("img");
        dishImage.src = dish.image;
        dishItem.appendChild(dishImage);

        var hr = document.createElement("br"); // Add horizontal line
        dishItem.appendChild(hr);
        var hr = document.createElement("br"); // Add horizontal line
        dishItem.appendChild(hr);
        var hr = document.createElement("br"); // Add horizontal line
        dishItem.appendChild(hr);


        dishesList.appendChild(dishItem);


    });


    orderInfoDiv.appendChild(dishesList);
}


// Retrieve the order ID from the URL parameter
var urlParams = new URLSearchParams(window.location.search);
var orderId = urlParams.get('id');

// Fetch and display the order details
fetchOrderDetails(orderId);


function logout() {
    fetch('https://food-delivery.kreosoft.ru/api/account/logout', {
        method: 'POST'
    })
        .then(response => {
            window.location.href = '../../index.html';
        })
        .catch(error => {
            console.error('Logout failed:', error);
        });
}