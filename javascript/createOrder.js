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