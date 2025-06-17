document.addEventListener("DOMContentLoaded", function () {
    getToken().then(function (token) {
        if (token) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "https://food-delivery.kreosoft.ru/api/order", true);
            xhr.setRequestHeader("accept", "application/json");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var orders = JSON.parse(xhr.responseText);
                        displayOrders(orders, token);
                    } else {
                        console.log("Error: " + xhr.status + " " + xhr.statusText);
                    }
                }
            };
            xhr.send();
        } else {
            console.log("No authentication token found.");
        }
    });
});

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

function displayOrders(orders, token) {
    var ordersDiv = document.getElementById("orders");
    ordersDiv.innerHTML = "";

    if (orders.length === 0) {
        ordersDiv.textContent = "No orders found.";
        return;
    }

    var reversedOrders = orders.slice().reverse(); // Reverse the order of the orders array

    var ordersList = document.createElement("ul");
    reversedOrders.forEach(function (order) {
        var listItem = document.createElement("li");
        listItem.id = "order_" + order.id; // Assign an ID to the order element
        listItem.style.cursor = "pointer"; // Add cursor style

        // Add order date and status
        var orderInfo = document.createElement("div");
        var orderDate = new Date(Date.parse(order.date));
        orderInfo.textContent = "Date: " + orderDate.toDateString() + " | Status: " + order.status;
        listItem.appendChild(orderInfo);

        // Add delivery time
        var deliveryTime = document.createElement("div");
        var formattedDeliveryTime = order.deliveryTime.substring(0, 10) + " " + order.deliveryTime.substring(11, 16);
        deliveryTime.textContent = "Delivery Time: " + formattedDeliveryTime;
        listItem.appendChild(deliveryTime);

        // Fetch order details to get the total price
        fetchOrderDetails(order.id, token).then(function (orderDetails) {
            var totalPrice = orderDetails.price;
            // Add total order cost
            var totalCost = document.createElement("div");
            totalCost.textContent = "Total Cost: " + totalPrice;
            listItem.appendChild(totalCost);

            if (order.status !== "Delivered") {
                // Add confirm delivery button
                var confirmButton = document.createElement("button");
                confirmButton.textContent = "Confirm Delivery";
                confirmButton.className = "confirm-button";

                confirmButton.addEventListener("click", function (event) {
                    event.stopPropagation(); // Prevent the click event from bubbling up to the list item
                    // Handle confirm delivery action here
                    confirmDelivery(order.id, token);
                });
                listItem.appendChild(confirmButton);
            }

            // Add horizontal line
            var horizontalLine = document.createElement("hr");
            listItem.appendChild(horizontalLine);
        });

        listItem.addEventListener("click", function () {
            // Handle order item click
            openOrderInfoPage(order.id);
        });

        ordersList.appendChild(listItem);
    });

    ordersDiv.appendChild(ordersList);
}


function fetchOrderDetails(orderId, token) {
    if (token) {
        return fetch("https://food-delivery.kreosoft.ru/api/order/" + orderId, {
            headers: {
                "accept": "application/json",
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
            .catch(function (error) {
                console.log("Error fetching order details:", error);
            });
    } else {
        console.log("No authentication token found.");
    }
}

function confirmDelivery(orderId, token) {
    if (token) {
        var apiUrl = "https://food-delivery.kreosoft.ru/api/order/" + orderId + "/status";
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(function (response) {
                if (response.ok) {
                    // Refresh the page after confirming delivery
                    location.reload();
                } else {
                    console.log("Error confirming delivery:", response.status, response.statusText);
                }
            })
            .catch(function (error) {
                console.log("Error confirming delivery:", error);
            });
    } else {
        console.log("No authentication token found.");
    }
}


function openOrderInfoPage(orderId) {
    var url = "orderInfo.html?id=" + orderId;
    window.location.href = url;
}



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





// document.addEventListener("DOMContentLoaded", function () {
//     getToken().then(function (token) {
//         if (token) {
//             var xhr = new XMLHttpRequest();
//             xhr.open("GET", "https://food-delivery.kreosoft.ru/api/order", true);
//             xhr.setRequestHeader("accept", "application/json");
//             xhr.setRequestHeader("Authorization", "Bearer " + token);
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         var orders = JSON.parse(xhr.responseText);
//                         displayOrders(orders, token);
//                     } else {
//                         console.log("Error: " + xhr.status + " " + xhr.statusText);
//                     }
//                 }
//             };
//             xhr.send();
//         } else {
//             console.log("No authentication token found.");
//         }
//     });
// });

// function retrieveToken() {
//     return fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
//         headers: {
//             'Accept': 'text/plain'
//         }
//     })
//         .then(function (response) {
//             if (response.ok) {
//                 return response.text();
//             } else {
//                 throw new Error('Failed to retrieve token');
//             }
//         })
//         .then(function (token) {
//             localStorage.setItem('token', JSON.stringify(token));
//             return token;
//         })
//         .catch(function (error) {
//             console.log('Error retrieving token:', error);
//         });
// }

// async function getToken() {
//     let token = JSON.parse(localStorage.getItem('token'));

//     if (!token) {
//         token = await retrieveToken();
//     }

//     return token;
// }

// function displayOrders(orders, token) {
//     var ordersDiv = document.getElementById("orders");
//     ordersDiv.innerHTML = "";

//     if (orders.length === 0) {
//         ordersDiv.textContent = "No orders found.";
//         return;
//     }

//     var reversedOrders = orders.slice().reverse(); // Reverse the order of the orders array

//     var ordersList = document.createElement("ul");
//     reversedOrders.forEach(function (order) {
//         var listItem = document.createElement("li");
//         listItem.id = "order_" + order.id; // Assign an ID to the order element

//         // Add order date and status
//         var orderInfo = document.createElement("div");
//         var orderDate = new Date(Date.parse(order.date));
//         orderInfo.textContent = "Date: " + orderDate.toDateString() + " | Status: " + order.status;
//         listItem.appendChild(orderInfo);

//         // Add delivery time
//         var deliveryTime = document.createElement("div");
//         var formattedDeliveryTime = order.deliveryTime.substring(0, 10) + " " + order.deliveryTime.substring(11, 16);
//         deliveryTime.textContent = "Delivery Time: " + formattedDeliveryTime;
//         listItem.appendChild(deliveryTime);

//         // Fetch order details to get the total price
//         fetchOrderDetails(order.id, token).then(function (orderDetails) {
//             var totalPrice = orderDetails.price;
//             // Add total order cost
//             var totalCost = document.createElement("div");
//             totalCost.textContent = "Total Cost: " + totalPrice;
//             listItem.appendChild(totalCost);

//             if (order.status !== "Delivered") {
//                 // Add confirm delivery button
//                 var confirmButton = document.createElement("button");
//                 confirmButton.textContent = "Confirm Delivery";
//                 confirmButton.className = "confirm-button";

//                 confirmButton.addEventListener("click", function () {
//                     // Handle confirm delivery action here
//                     confirmDelivery(order.id, token);
//                 });
//                 listItem.appendChild(confirmButton);
//             }

//             // Add horizontal line
//             var horizontalLine = document.createElement("hr");
//             listItem.appendChild(horizontalLine);
//         });

//         ordersList.appendChild(listItem);
//     });

//     ordersDiv.appendChild(ordersList);
// }

// function fetchOrderDetails(orderId, token) {
//     if (token) {
//         return fetch("https://food-delivery.kreosoft.ru/api/order/" + orderId, {
//             headers: {
//                 "accept": "application/json",
//                 "Authorization": "Bearer " + token
//             }
//         })
//             .then(function (response) {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     throw new Error("Failed to fetch order details");
//                 }
//             })
//             .catch(function (error) {
//                 console.log("Error fetching order details:", error);
//             });
//     } else {
//         console.log("No authentication token found.");
//     }
// }

// function confirmDelivery(orderId, token) {
//     if (token) {
//         var apiUrl = "https://food-delivery.kreosoft.ru/api/order/" + orderId + "/status";
//         fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "accept": "application/json",
//                 "Authorization": "Bearer " + token
//             }
//         })
//             .then(function (response) {
//                 if (response.ok) {
//                     // Refresh the page after confirming delivery
//                     location.reload();
//                 } else {
//                     console.log("Error confirming delivery:", response.status, response.statusText);
//                 }
//             })
//             .catch(function (error) {
//                 console.log("Error confirming delivery:", error);
//             });
//     } else {
//         console.log("No authentication token found.");
//     }
// }


// function logout() {
//     fetch('https://food-delivery.kreosoft.ru/api/account/logout', {
//         method: 'POST'
//     })
//         .then(response => {
//             window.location.href = '../../index.html';
//         })
//         .catch(error => {
//             console.error('Logout failed:', error);
//         });
// }

// function createNewOrder() {
//     window.location.href = '../html/createOrder.html';
// }












// document.addEventListener("DOMContentLoaded", function () {
//     getToken().then(function (token) {
//         if (token) {
//             var xhr = new XMLHttpRequest();
//             xhr.open("GET", "https://food-delivery.kreosoft.ru/api/order", true);
//             xhr.setRequestHeader("accept", "application/json");
//             xhr.setRequestHeader("Authorization", "Bearer " + token);
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         var orders = JSON.parse(xhr.responseText);
//                         displayOrders(orders, token);
//                     } else {
//                         console.log("Error: " + xhr.status + " " + xhr.statusText);
//                     }
//                 }
//             };
//             xhr.send();
//         } else {
//             console.log("No authentication token found.");
//         }
//     });
// });

// function retrieveToken() {
//     return fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
//         headers: {
//             'Accept': 'text/plain'
//         }
//     })
//         .then(function (response) {
//             if (response.ok) {
//                 return response.text();
//             } else {
//                 throw new Error('Failed to retrieve token');
//             }
//         })
//         .then(function (token) {
//             localStorage.setItem('token', JSON.stringify(token));
//             return token;
//         })
//         .catch(function (error) {
//             console.log('Error retrieving token:', error);
//         });
// }

// async function getToken() {
//     let token = JSON.parse(localStorage.getItem('token'));

//     if (!token) {
//         token = await retrieveToken();
//     }

//     return token;
// }

// function displayOrders(orders, token) {
//     var ordersDiv = document.getElementById("orders");
//     ordersDiv.innerHTML = "";

//     if (orders.length === 0) {
//         ordersDiv.textContent = "No orders found.";
//         return;
//     }

//     var reversedOrders = orders.slice().reverse(); // Reverse the order of the orders array

//     var ordersList = document.createElement("ul");
//     reversedOrders.forEach(function (order) {
//         var listItem = document.createElement("li");
//         listItem.id = "order_" + order.id; // Assign an ID to the order element

//         // Add order date and status
//         var orderInfo = document.createElement("div");
//         var orderDate = new Date(Date.parse(order.date));
//         orderInfo.textContent = "Date: " + orderDate.toDateString() + " | Status: " + order.status;
//         listItem.appendChild(orderInfo);

//         // Add delivery time
//         var deliveryTime = document.createElement("div");
//         var formattedDeliveryTime = order.deliveryTime.substring(0, 10) + " " + order.deliveryTime.substring(11, 16);
//         deliveryTime.textContent = "Delivery Time: " + formattedDeliveryTime;
//         listItem.appendChild(deliveryTime);

//         // Fetch order details to get the total price
//         fetchOrderDetails(order.id, token).then(function (orderDetails) {
//             var totalPrice = orderDetails.price;
//             // Add total order cost
//             var totalCost = document.createElement("div");
//             totalCost.textContent = "Total Cost: " + totalPrice;
//             listItem.appendChild(totalCost);

//             if (order.status !== "Delivered") {
//                 // Add confirm delivery button
//                 var confirmButton = document.createElement("button");
//                 confirmButton.textContent = "Confirm Delivery";
//                 confirmButton.addEventListener("click", function () {
//                     // Handle confirm delivery action here
//                     confirmDelivery(order.id, token);
//                 });
//                 listItem.appendChild(confirmButton);
//             }

//             // Add horizontal line
//             var horizontalLine = document.createElement("hr");
//             listItem.appendChild(horizontalLine);
//         });

//         ordersList.appendChild(listItem);
//     });

//     ordersDiv.appendChild(ordersList);
// }

// function fetchOrderDetails(orderId, token) {
//     if (token) {
//         return fetch("https://food-delivery.kreosoft.ru/api/order/" + orderId, {
//             headers: {
//                 "accept": "application/json",
//                 "Authorization": "Bearer " + token
//             }
//         })
//             .then(function (response) {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     throw new Error("Failed to fetch order details");
//                 }
//             })
//             .catch(function (error) {
//                 console.log("Error fetching order details:", error);
//             });
//     } else {
//         console.log("No authentication token found.");
//     }
// }

// function confirmDelivery(orderId, token) {
//     if (token) {
//         var apiUrl = "https://food-delivery.kreosoft.ru/api/order/" + orderId + "/status";
//         fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "accept": "application/json",
//                 "Authorization": "Bearer " + token
//             }
//         })
//             .then(function (response) {
//                 if (response.ok) {
//                     // Refresh the page after confirming delivery
//                     location.reload();
//                 } else {
//                     console.log("Error confirming delivery:", response.status, response.statusText);
//                 }
//             })
//             .catch(function (error) {
//                 console.log("Error confirming delivery:", error);
//             });
//     } else {
//         console.log("No authentication token found.");
//     }
// }


// function logout() {
//     fetch('https://food-delivery.kreosoft.ru/api/account/logout', {
//         method: 'POST'
//     })
//         .then(response => {
//             window.location.href = '../../index.html';
//         })
//         .catch(error => {
//             console.error('Logout failed:', error);
//         });
// }

// function createNewOrder() {
//     window.location.href = '../html/createOrder.html';
// }
















// document.addEventListener("DOMContentLoaded", function () {
//     getToken().then(function (token) {
//         if (token) {
//             var xhr = new XMLHttpRequest();
//             xhr.open("GET", "https://food-delivery.kreosoft.ru/api/order", true);
//             xhr.setRequestHeader("accept", "application/json");
//             xhr.setRequestHeader("Authorization", "Bearer " + token);
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         var orders = JSON.parse(xhr.responseText);
//                         displayOrders(orders, token);
//                     } else {
//                         console.log("Error: " + xhr.status + " " + xhr.statusText);
//                     }
//                 }
//             };
//             xhr.send();
//         } else {
//             console.log("No authentication token found.");
//         }
//     });
// });

// function retrieveToken() {
//     return fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
//         headers: {
//             'Accept': 'text/plain'
//         }
//     })
//         .then(function (response) {
//             if (response.ok) {
//                 return response.text();
//             } else {
//                 throw new Error('Failed to retrieve token');
//             }
//         })
//         .then(function (token) {
//             localStorage.setItem('token', JSON.stringify(token));
//             return token;
//         })
//         .catch(function (error) {
//             console.log('Error retrieving token:', error);
//         });
// }

// async function getToken() {
//     let token = JSON.parse(localStorage.getItem('token'));

//     if (!token) {
//         token = await retrieveToken();
//     }

//     return token;
// }

// function displayOrders(orders, token) {
//     var ordersDiv = document.getElementById("orders");
//     ordersDiv.innerHTML = "";

//     if (orders.length === 0) {
//         ordersDiv.textContent = "No orders found.";
//         return;
//     }

//     var reversedOrders = orders.slice().reverse(); // Reverse the order of the orders array

//     var ordersList = document.createElement("ul");
//     reversedOrders.forEach(function (order) {
//         var listItem = document.createElement("li");
//         listItem.id = "order_" + order.id; // Assign an ID to the order element

//         // Add order date and status
//         var orderInfo = document.createElement("div");
//         var orderDate = new Date(order.date);
//         orderInfo.textContent = "Date: " + orderDate.toDateString() + " | Status: " + order.status;
//         listItem.appendChild(orderInfo);

//         // Add delivery time
//         var deliveryTime = document.createElement("div");
//         deliveryTime.textContent = "Delivery Time: " + order.deliveryTime;
//         listItem.appendChild(deliveryTime);

//         // Fetch order details to get the total price
//         fetchOrderDetails(order.id, token).then(function (orderDetails) {
//             var totalPrice = orderDetails.price;
//             // Add total order cost
//             var totalCost = document.createElement("div");
//             totalCost.textContent = "Total Cost: " + totalPrice;
//             listItem.appendChild(totalCost);

//             if (order.status !== "Delivered") {
//                 // Add confirm delivery button
//                 var confirmButton = document.createElement("button");
//                 confirmButton.textContent = "Confirm Delivery";
//                 confirmButton.addEventListener("click", function () {
//                     // Handle confirm delivery action here
//                     confirmDelivery(order.id, token);
//                 });
//                 listItem.appendChild(confirmButton);
//             }

//             // Add horizontal line
//             var horizontalLine = document.createElement("hr");
//             listItem.appendChild(horizontalLine);
//         });

//         ordersList.appendChild(listItem);
//     });

//     ordersDiv.appendChild(ordersList);
// }



// function fetchOrderDetails(orderId, token) {
//     if (token) {
//         return fetch("https://food-delivery.kreosoft.ru/api/order/" + orderId, {
//             headers: {
//                 "accept": "application/json",
//                 "Authorization": "Bearer " + token
//             }
//         })
//             .then(function (response) {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     throw new Error("Failed to fetch order details");
//                 }
//             })
//             .catch(function (error) {
//                 console.log("Error fetching order details:", error);
//             });
//     } else {
//         console.log("No authentication token found.");
//     }
// }

// function confirmDelivery(orderId, token) {
//     if (token) {
//         var apiUrl = "https://food-delivery.kreosoft.ru/api/order/" + orderId + "/status";
//         fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "accept": "application/json",
//                 "Authorization": "Bearer " + token
//             }
//         })
//             .then(function (response) {
//                 if (response.ok) {
//                     // Refresh the page after confirming delivery
//                     location.reload();
//                 } else {
//                     console.log("Error confirming delivery:", response.status, response.statusText);
//                 }
//             })
//             .catch(function (error) {
//                 console.log("Error confirming delivery:", error);
//             });
//     } else {
//         console.log("No authentication token found.");
//     }
// }















// document.addEventListener("DOMContentLoaded", function () {
//     getToken().then(function (token) {
//         if (token) {
//             var xhr = new XMLHttpRequest();
//             xhr.open("GET", "https://food-delivery.kreosoft.ru/api/order", true);
//             xhr.setRequestHeader("accept", "application/json");
//             xhr.setRequestHeader("Authorization", "Bearer " + token);
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         var orders = JSON.parse(xhr.responseText);
//                         displayOrders(orders, token);
//                     } else {
//                         console.log("Error: " + xhr.status + " " + xhr.statusText);
//                     }
//                 }
//             };
//             xhr.send();
//         } else {
//             console.log("No authentication token found.");
//         }
//     });
// });

// function retrieveToken() {
//     return fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
//         headers: {
//             'Accept': 'text/plain'
//         }
//     })
//         .then(function (response) {
//             if (response.ok) {
//                 return response.text();
//             } else {
//                 throw new Error('Failed to retrieve token');
//             }
//         })
//         .then(function (token) {
//             localStorage.setItem('token', JSON.stringify(token));
//             return token;
//         })
//         .catch(function (error) {
//             console.log('Error retrieving token:', error);
//         });
// }

// async function getToken() {
//     let token = JSON.parse(localStorage.getItem('token'));

//     if (!token) {
//         token = await retrieveToken();
//     }

//     return token;
// }

// function displayOrders(orders, token) {
//     var ordersDiv = document.getElementById("orders");
//     ordersDiv.innerHTML = "";

//     if (orders.length === 0) {
//         ordersDiv.textContent = "No orders found.";
//         return;
//     }

//     var reversedOrders = orders.slice().reverse(); // Reverse the order of the orders array

//     var ordersList = document.createElement("ul");
//     reversedOrders.forEach(function (order) {
//         var listItem = document.createElement("li");
//         listItem.id = "order_" + order.id; // Assign an ID to the order element

//         // Add order date and status
//         var orderInfo = document.createElement("div");
//         var orderDate = new Date(order.date);
//         orderInfo.textContent = "Date: " + orderDate.toDateString() + " | Status: " + order.status;
//         listItem.appendChild(orderInfo);

//         // Add delivery time
//         var deliveryTime = document.createElement("div");
//         deliveryTime.textContent = "Delivery Time: " + order.deliveryTime;
//         listItem.appendChild(deliveryTime);

//         // Fetch order details to get the total price
//         fetchOrderDetails(order.id, token).then(function (orderDetails) {
//             var totalPrice = orderDetails.price;
//             // Add total order cost
//             var totalCost = document.createElement("div");
//             totalCost.textContent = "Total Cost: " + totalPrice;
//             listItem.appendChild(totalCost);

//             if (order.status !== "Delivered") {
//                 // Add confirm delivery button
//                 var confirmButton = document.createElement("button");
//                 confirmButton.textContent = "Confirm Delivery";
//                 confirmButton.addEventListener("click", function () {
//                     // Handle confirm delivery action here
//                     confirmDelivery(order.id, token);
//                 });
//                 listItem.appendChild(confirmButton);
//             }

//             // Add horizontal line
//             var horizontalLine = document.createElement("hr");
//             listItem.appendChild(horizontalLine);
//         });

//         ordersList.appendChild(listItem);
//     });

//     ordersDiv.appendChild(ordersList);
// }



// function fetchOrderDetails(orderId, token) {
//     if (token) {
//         return fetch("https://food-delivery.kreosoft.ru/api/order/" + orderId, {
//             headers: {
//                 "accept": "application/json",
//                 "Authorization": "Bearer " + token
//             }
//         })
//             .then(function (response) {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     throw new Error("Failed to fetch order details");
//                 }
//             })
//             .catch(function (error) {
//                 console.log("Error fetching order details:", error);
//             });
//     } else {
//         console.log("No authentication token found.");
//     }
// }

// function confirmDelivery(orderId, token) {
//     if (token) {
//         var apiUrl = "https://food-delivery.kreosoft.ru/api/order/" + orderId + "/status";
//         fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "accept": "application/json",
//                 "Authorization": "Bearer " + token
//             }
//         })
//             .then(function (response) {
//                 if (response.ok) {
//                     // Refresh the page after confirming delivery
//                     location.reload();
//                 } else {
//                     console.log("Error confirming delivery:", response.status, response.statusText);
//                 }
//             })
//             .catch(function (error) {
//                 console.log("Error confirming delivery:", error);
//             });
//     } else {
//         console.log("No authentication token found.");
//     }
// }













// document.addEventListener("DOMContentLoaded", function () {
//     getToken().then(function (token) {
//         if (token) {
//             var xhr = new XMLHttpRequest();
//             xhr.open("GET", "https://food-delivery.kreosoft.ru/api/order", true);
//             xhr.setRequestHeader("accept", "application/json");
//             xhr.setRequestHeader("Authorization", "Bearer " + token);
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         var orders = JSON.parse(xhr.responseText);
//                         displayOrders(orders);
//                     } else {
//                         console.log("Error: " + xhr.status + " " + xhr.statusText);
//                     }
//                 }
//             };
//             xhr.send();
//         } else {
//             console.log("No authentication token found.");
//         }
//     });
// });

// function retrieveToken() {
//     return fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
//         headers: {
//             'Accept': 'text/plain'
//         }
//     })
//         .then(function (response) {
//             if (response.ok) {
//                 return response.text();
//             } else {
//                 throw new Error('Failed to retrieve token');
//             }
//         })
//         .then(function (token) {
//             localStorage.setItem('token', JSON.stringify(token));
//             return token;
//         })
//         .catch(function (error) {
//             console.log('Error retrieving token:', error);
//         });
// }

// async function getToken() {
//     let token = JSON.parse(localStorage.getItem('token'));

//     if (!token) {
//         token = await retrieveToken();
//     }

//     return token;
// }

// function displayOrders(orders) {
//     var ordersDiv = document.getElementById("orders");
//     ordersDiv.innerHTML = "";

//     if (orders.length === 0) {
//         ordersDiv.textContent = "No orders found.";
//         return;
//     }

//     var ordersList = document.createElement("ul");
//     orders.forEach(function (order) {
//         var listItem = document.createElement("li");
//         listItem.id = "order_" + order.id; // Assign an ID to the order element
//         listItem.textContent = "Order ID: " + order.id;

//         // Add order date and status
//         var orderInfo = document.createElement("div");
//         var orderDate = new Date(order.date);
//         orderInfo.textContent = "Date: " + orderDate.toDateString() + " | Status: " + order.status;
//         listItem.appendChild(orderInfo);

//         // Add delivery time
//         var deliveryTime = document.createElement("div");
//         deliveryTime.textContent = "Delivery Time: " + order.deliveryTime;
//         listItem.appendChild(deliveryTime);

//         // Add confirm delivery button
//         var confirmButton = document.createElement("button");
//         confirmButton.textContent = "Confirm Delivery";
//         confirmButton.addEventListener("click", function () {
//             // Handle confirm delivery action here
//             confirmDelivery(order.id);
//         });
//         listItem.appendChild(confirmButton);

//         // Add horizontal line
//         var horizontalLine = document.createElement("hr");
//         listItem.appendChild(horizontalLine);

//         ordersList.appendChild(listItem);
//     });

//     ordersDiv.appendChild(ordersList);
// }

// function confirmDelivery(orderId) {
//     getToken().then(function (token) {
//         if (token) {
//             var url = "https://food-delivery.kreosoft.ru/api/order/" + orderId + "/status";
//             var xhr = new XMLHttpRequest();
//             xhr.open("POST", url, true);
//             xhr.setRequestHeader("accept", "application/json");
//             xhr.setRequestHeader("Authorization", "Bearer " + token);
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         // Update the order status
//                         updateOrderStatus(orderId, "Delivered");
//                         console.log("Delivery confirmed for order ID: " + orderId);
//                     } else {
//                         console.log("Error: " + xhr.status + " " + xhr.statusText);
//                     }
//                 }
//             };
//             xhr.send();
//         } else {
//             console.log("No authentication token found.");
//         }
//     });
// }

// function updateOrderStatus(orderId, status) {
//     // Update the order status on the page
//     var orderElement = document.getElementById("order_" + orderId);
//     if (orderElement) {
//         var statusElement = orderElement.querySelector(".status");
//         if (statusElement) {
//             statusElement.textContent = "Status: " + status;
//         }
//     }

//     // Refresh the page
//     location.reload();
// }



































// document.addEventListener("DOMContentLoaded", function () {
//     getToken().then(function (token) {
//         if (token) {
//             var xhr = new XMLHttpRequest();
//             xhr.open("GET", "https://food-delivery.kreosoft.ru/api/order", true);
//             xhr.setRequestHeader("accept", "application/json");
//             xhr.setRequestHeader("Authorization", "Bearer " + token);
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         var orders = JSON.parse(xhr.responseText);
//                         displayOrders(orders);
//                     } else {
//                         console.log("Error: " + xhr.status + " " + xhr.statusText);
//                     }
//                 }
//             };
//             xhr.send();
//         } else {
//             console.log("No authentication token found.");
//         }
//     });
// });

// function retrieveToken() {
//     return fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
//         headers: {
//             'Accept': 'text/plain'
//         }
//     })
//         .then(function (response) {
//             if (response.ok) {
//                 return response.text();
//             } else {
//                 throw new Error('Failed to retrieve token');
//             }
//         })
//         .then(function (token) {
//             localStorage.setItem('token', JSON.stringify(token));
//             return token;
//         })
//         .catch(function (error) {
//             console.log('Error retrieving token:', error);
//         });
// }

// async function getToken() {
//     let token = JSON.parse(localStorage.getItem('token'));

//     if (!token) {
//         token = await retrieveToken();
//     }

//     return token;
// }

// function displayOrders(orders) {
//     var ordersDiv = document.getElementById("orders");
//     ordersDiv.innerHTML = "";

//     if (orders.length === 0) {
//         ordersDiv.textContent = "No orders found.";
//         return;
//     }

//     var ordersList = document.createElement("ul");
//     orders.forEach(function (order) {
//         var listItem = document.createElement("li");
//         listItem.textContent = "Order ID: " + order.id;
//         ordersList.appendChild(listItem);
//     });

//     ordersDiv.appendChild(ordersList);
// }













