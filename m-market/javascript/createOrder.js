














function getToken() {
    const token = JSON.parse(localStorage.getItem('token'));
    return token;
}

async function fetchCartItems() {
    try {
        const token = getToken();
        const response = await fetch('https://food-delivery.kreosoft.ru/api/basket', {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Cart items:', data);

            const cartItemsContainer = document.getElementById('cart-items');
            cartItemsContainer.innerHTML = '';

            data.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');

                const itemImage = document.createElement('img');
                itemImage.src = item.image;
                itemImage.alt = item.name;
                itemImage.style.width = '100px';
                itemImage.style.height = 'auto';
                cartItemDiv.appendChild(itemImage);

                const itemDetailsDiv = document.createElement('div');
                itemDetailsDiv.classList.add('item-details');

                const itemName = document.createElement('span');
                itemName.classList.add('item-name');
                itemName.innerHTML = `<strong>${item.name}</strong>`;
                itemDetailsDiv.appendChild(itemName);

                const itemPrice = document.createElement('span');
                itemPrice.classList.add('item-price');
                itemPrice.textContent = item.price !== undefined ? `Price: ${item.price} ₽` : 'Price not available';
                itemDetailsDiv.appendChild(itemPrice);

                const itemQuantity = document.createElement('span');
                itemQuantity.classList.add('item-quantity');
                itemQuantity.textContent = `Quantity: ${item.amount}`;
                itemDetailsDiv.appendChild(itemQuantity);

                cartItemDiv.appendChild(itemDetailsDiv);

                const itemTotalPrice = document.createElement('span');
                itemTotalPrice.classList.add('item-total-price');
                const totalPrice = item.price !== undefined ? item.price * item.amount : 0;
                itemTotalPrice.textContent = `${totalPrice} ₽`;
                cartItemDiv.appendChild(itemTotalPrice);

                cartItemsContainer.appendChild(cartItemDiv);
            });
        } else {
            throw new Error('Failed to fetch cart items');
        }
    } catch (error) {
        console.log('Error fetching cart items:', error);
    }
}

const orderButton = document.getElementById('orderButton');
orderButton.addEventListener('click', sendDishesToOrder);

function calculateDeliveryTime() {
    const currentDatetime = new Date();
    const deliveryDatetime = new Date(currentDatetime.getTime() + 60 * 60 * 1000); // Add 60 minutes to the current datetime

    const year = deliveryDatetime.getFullYear();
    const month = String(deliveryDatetime.getMonth() + 1).padStart(2, '0');
    const day = String(deliveryDatetime.getDate()).padStart(2, '0');
    const hours = String(deliveryDatetime.getHours()).padStart(2, '0');
    const minutes = String(deliveryDatetime.getMinutes()).padStart(2, '0');
    const seconds = String(deliveryDatetime.getSeconds()).padStart(2, '0');

    const deliveryTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return deliveryTime;
}











async function sendDishesToOrder(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
        const token = await getToken();
        const deliveryTime = calculateDeliveryTime();
        const addressInput = document.getElementById('address-input');
        const address = addressInput.value.trim();

        if (address === '') {
            console.log('Please enter your address');
            return;
        }

        const response = await fetch('https://food-delivery.kreosoft.ru/api/order', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                deliveryTime: deliveryTime,
                address: address
            })
        });

        const responseData = await response.text(); // Read the response as text

        if (response.ok) {
            console.log('Order placed successfully:', responseData);
            // Redirect to the order page
            window.location.href = '../html/order.html';
        } else {
            if (responseData) {
                const errorData = JSON.parse(responseData);
                throw new Error(`Failed to place order: ${errorData.message}`);
            } else {
                throw new Error('Failed to place order. Empty response received.');
            }
        }
    } catch (error) {
        console.log('Error placing order:', error);
    }
}


fetchCartItems();
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

function createNewOrder() {
    window.location.href = '../html/createOrder.html';
}









// function getToken() {
//     const token = JSON.parse(localStorage.getItem('token'));
//     return token;
// }

// // Retrieve the cart items from the API
// async function fetchCartItems() {
//     try {
//         const token = getToken();
//         const response = await fetch('https://food-delivery.kreosoft.ru/api/basket', {
//             headers: {
//                 'accept': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Cart items:', data);

//             const cartItemsContainer = document.getElementById('cart-items');
//             cartItemsContainer.innerHTML = '';

//             data.forEach(item => {
//                 const cartItemDiv = document.createElement('div');
//                 cartItemDiv.classList.add('cart-item');

//                 const itemImage = document.createElement('img');
//                 itemImage.src = item.image; // Set the image source
//                 itemImage.alt = item.name; // Set the alt attribute for accessibility
//                 itemImage.style.width = '100px'; // Set the width of the image
//                 itemImage.style.height = 'auto'; // Automatically adjust the height to maintain aspect ratio
//                 cartItemDiv.appendChild(itemImage);

//                 const itemDetailsDiv = document.createElement('div');
//                 itemDetailsDiv.classList.add('item-details');

//                 const itemName = document.createElement('span');
//                 itemName.classList.add('item-name');
//                 itemName.innerHTML = `<strong>${item.name}</strong>`;
//                 itemDetailsDiv.appendChild(itemName);

//                 const itemPrice = document.createElement('span');
//                 itemPrice.classList.add('item-price');
//                 itemPrice.textContent = item.price !== undefined ? `Price: ${item.price} ₽` : 'Price not available';
//                 itemDetailsDiv.appendChild(itemPrice);

//                 const itemQuantity = document.createElement('span');
//                 itemQuantity.classList.add('item-quantity');
//                 itemQuantity.textContent = `Quantity: ${item.amount}`;
//                 itemDetailsDiv.appendChild(itemQuantity);

//                 cartItemDiv.appendChild(itemDetailsDiv);

//                 const itemTotalPrice = document.createElement('span');
//                 itemTotalPrice.classList.add('item-total-price');
//                 const totalPrice = item.price !== undefined ? item.price * item.amount : 0;
//                 itemTotalPrice.textContent = `${totalPrice} ₽`;
//                 cartItemDiv.appendChild(itemTotalPrice);

//                 cartItemsContainer.appendChild(cartItemDiv);
//             });
//         } else {
//             throw new Error('Failed to fetch cart items');
//         }
//     } catch (error) {
//         console.log('Error retrieving cart items:', error);
//     }
// }

// // Call the function to fetch cart items when the page loads
// fetchCartItems();
























// function getToken() {
//     const token = JSON.parse(localStorage.getItem('token'));
//     return token;
// }

// // Retrieve the cart items from the API
// async function fetchCartItems() {
//     try {
//         const token = getToken();
//         const response = await fetch('https://food-delivery.kreosoft.ru/api/basket', {
//             headers: {
//                 'accept': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Cart items:', data);

//             const cartItemsContainer = document.getElementById('cart-items');
//             cartItemsContainer.innerHTML = '';

//             data.forEach(item => {
//                 const cartItemDiv = document.createElement('div');
//                 cartItemDiv.classList.add('cart-item');

//                 const itemImage = document.createElement('img');
//                 itemImage.src = item.image; // Set the image source
//                 itemImage.alt = item.name; // Set the alt attribute for accessibility
//                 itemImage.style.width = '100px'; // Set the width of the image
//                 itemImage.style.height = 'auto'; // Automatically adjust the height to maintain aspect ratio
//                 cartItemDiv.appendChild(itemImage);

//                 const itemName = document.createElement('span');
//                 itemName.classList.add('item-name');
//                 itemName.textContent = item.name;
//                 cartItemDiv.appendChild(itemName);

//                 const itemPrice = document.createElement('span');
//                 itemPrice.classList.add('item-price');
//                 itemPrice.textContent = item.price !== undefined ? `${item.price} ₽` : 'Price not available';
//                 cartItemDiv.appendChild(itemPrice);

//                 cartItemsContainer.appendChild(cartItemDiv);
//             });
//         } else {
//             throw new Error('Failed to fetch cart items');
//         }
//     } catch (error) {
//         console.log('Error retrieving cart items:', error);
//     }
// }

// // Call the function to fetch cart items when the page loads
// fetchCartItems();




















// function getToken() {
//     const token = JSON.parse(localStorage.getItem('token'));
//     return token;
// }

// // Retrieve the cart items from the API
// async function fetchCartItems() {
//     try {
//         const response = await fetch('https://food-delivery.kreosoft.ru/api/basket', {
//             headers: {
//                 'accept': 'text/plain',
//                 'Authorization': `Bearer ${getToken()}`
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Cart items:', data);

//             const cartItemsContainer = document.getElementById('cart-items');
//             cartItemsContainer.innerHTML = '';

//             data.forEach(item => {
//                 const cartItemDiv = document.createElement('div');
//                 cartItemDiv.classList.add('cart-item');

//                 const itemName = document.createElement('span');
//                 itemName.textContent = item.name;
//                 cartItemDiv.appendChild(itemName);

//                 const itemPrice = document.createElement('span');
//                 itemPrice.textContent = item.price !== undefined ? `${item.price} ₽` : 'Price not available';
//                 cartItemDiv.appendChild(itemPrice);

//                 cartItemsContainer.appendChild(cartItemDiv);
//             });
//         } else {
//             throw new Error('Failed to fetch cart items');
//         }
//     } catch (error) {
//         console.log('Error retrieving cart items:', error);
//     }
// }

// // Call the function to fetch cart items when the page loads
// fetchCartItems();






// // Retrieve the cart items from the opener window
// let cartItems;
// try {
//     cartItems = JSON.parse(window.opener.localStorage.getItem('cartItems')) || [];
// } catch (error) {
//     console.log('Error retrieving cart items:', error);
//     cartItems = [];
// }

// // Display the cart items on the order page
// const cartItemsContainer = document.getElementById('cart-items');
// cartItemsContainer.innerHTML = '';

// cartItems.forEach(item => {
//     const cartItemDiv = document.createElement('div');
//     cartItemDiv.classList.add('cart-item');

//     const itemName = document.createElement('span');
//     itemName.textContent = item.name;
//     cartItemDiv.appendChild(itemName);

//     const itemPrice = document.createElement('span');
//     itemPrice.textContent = item.price !== undefined ? `${item.price} ₽` : 'Price not available';
//     cartItemDiv.appendChild(itemPrice);

//     cartItemsContainer.appendChild(cartItemDiv);
// });

// const orderForm = document.getElementById('order-form');
// orderForm.addEventListener('submit', function (event) {
//     event.preventDefault();

//     // Retrieve the form values
//     const phone = document.getElementById('phone-input').value.trim();
//     const email = document.getElementById('email-input').value.trim();
//     const address = document.getElementById('address-input').value.trim();
//     const deliveryTime = calculateDeliveryTime();

//     // Validate the form values
//     if (!phone || !email || !address) {
//         alert('Please fill in all the required fields');
//         return;
//     }

//     // Place the order
//     placeOrder(phone, email, address, deliveryTime);
// });

// function placeOrder(phone, email, address, deliveryTime) {
//     // Prepare the order data
//     const orderData = {
//         phone: phone,
//         email: email,
//         address: address,
//         deliveryTime: deliveryTime,
//         items: cartItems
//     };

//     // Perform the API request to place the order
//     fetch('https://food-delivery.kreosoft.ru/api/order', {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${getToken()}`
//         },
//         body: JSON.stringify(orderData)
//     })
//         .then(response => response.text())
//         .then(responseData => {
//             console.log('Order placed successfully:', responseData);
//             // You can perform additional actions here, such as displaying a success message
//             // or redirecting the user to a confirmation page
//         })
//         .catch(error => {
//             console.log('Error placing order:', error);
//             // You can handle the error here, such as displaying an error message to the user
//         });
// }

// // Function to retrieve the token from the profile endpoint
// async function retrieveToken() {
//     try {
//         const response = await fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
//             headers: {
//                 'Accept': 'text/plain'
//             }
//         });

//         if (response.ok) {
//             const token = await response.text();
//             localStorage.setItem('token', JSON.stringify(token));
//             return token;
//         } else {
//             throw new Error('Failed to retrieve token');
//         }
//     } catch (error) {
//         console.log('Error retrieving token:', error);
//     }
// }

// // Function to get the token from storage or fetch a new token
// async function getToken() {
//     let token = JSON.parse(localStorage.getItem('token'));

//     if (!token) {
//         token = await retrieveToken();
//     }

//     return token;
// }


// function calculateDeliveryTime() {
//     const currentDatetime = new Date();
//     const deliveryDatetime = new Date(currentDatetime.getTime() + 60 * 60 * 1000); // Add 60 minutes to the current datetime

//     const year = deliveryDatetime.getFullYear();
//     const month = String(deliveryDatetime.getMonth() + 1).padStart(2, '0');
//     const day = String(deliveryDatetime.getDate()).padStart(2, '0');
//     const hours = String(deliveryDatetime.getHours()).padStart(2, '0');
//     const minutes = String(deliveryDatetime.getMinutes()).padStart(2, '0');
//     const seconds = String(deliveryDatetime.getSeconds()).padStart(2, '0');

//     const deliveryTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
//     return deliveryTime;
// }


// async function fetchCartItems() {
//     try {
//         const token = await getToken();

//         const response = await fetch(cartUrl, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Accept': 'application/json'
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Cart items:', data);

//             const cartItemsDiv = document.getElementById('cart-items');
//             let totalPrice = 0; // Initialize total price

//             if (Array.isArray(data)) {
//                 // Create an array to hold the promises
//                 const promises = [];

//                 data.forEach((item, index) => {
//                     // Remaining code for creating cart item elements and promises
//                     // ...
//                 });

//                 // Wait for all promises to resolve
//                 Promise.all(promises)
//                     .then(() => {
//                         // Remaining code for calculating and displaying total price
//                         // ...
//                     })
//                     .catch(error => {
//                         console.log('Error calculating total price:', error);
//                         totalPriceElement.textContent = 'Error calculating total price'; // Display error message in the total price element
//                     });
//             } else {
//                 console.log('Invalid data format:', data);
//                 totalPriceElement.textContent = 'Invalid data format'; // Display error message in the total price element
//             }
//         } else {
//             throw new Error('Failed to fetch cart items');
//         }
//     } catch (error) {
//         console.log('Error fetching cart items:', error);
//         totalPriceElement.textContent = 'Error fetching cart items'; // Display error message in the total price element
//     }
// }
