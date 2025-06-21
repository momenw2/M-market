    // createOrder.js - After Commit 2
    function getToken() {
    const token = JSON.parse(localStorage.getItem("token"));
    return token;
    }

    async function fetchCartItems() {
    try {
        const token = getToken();
        const response = await fetch(
        "https://food-delivery.kreosoft.ru/api/basket",
        {
            headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            },
        }
        );

        if (response.ok) {
        const data = await response.json();
        console.log("Cart items:", data);

        const cartItemsContainer = document.getElementById("cart-items");
        cartItemsContainer.innerHTML = "";

        data.forEach((item) => {
            const cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cart-item");

            const itemImage = document.createElement("img");
            itemImage.src = item.image;
            itemImage.alt = item.name;
            itemImage.style.width = "100px";
            itemImage.style.height = "auto";
            cartItemDiv.appendChild(itemImage);

            const itemDetailsDiv = document.createElement("div");
            itemDetailsDiv.classList.add("item-details");

            const itemName = document.createElement("span");
            itemName.classList.add("item-name");
            itemName.innerHTML = `<strong>${item.name}</strong>`;
            itemDetailsDiv.appendChild(itemName);

            const itemPrice = document.createElement("span");
            itemPrice.classList.add("item-price");
            itemPrice.textContent =
            item.price !== undefined
                ? `Price: ${item.price} ₽`
                : "Price not available";
            itemDetailsDiv.appendChild(itemPrice);

            const itemQuantity = document.createElement("span");
            itemQuantity.classList.add("item-quantity");
            itemQuantity.textContent = `Quantity: ${item.amount}`;
            itemDetailsDiv.appendChild(itemQuantity);

            cartItemDiv.appendChild(itemDetailsDiv);

            const itemTotalPrice = document.createElement("span");
            itemTotalPrice.classList.add("item-total-price");
            const totalPrice =
            item.price !== undefined ? item.price * item.amount : 0;
            itemTotalPrice.textContent = `${totalPrice} ₽`;
            cartItemDiv.appendChild(itemTotalPrice);

            cartItemsContainer.appendChild(cartItemDiv);
        });
        } else {
        throw new Error("Failed to fetch cart items");
        }
    } catch (error) {
        console.log("Error fetching cart items:", error);
    }
    }

    function calculateDeliveryTime() {
    const deliveryTime = new Date(Date.now() + 60 * 60 * 1000);
    const year = deliveryTime.getFullYear();
    const month = String(deliveryTime.getMonth() + 1).padStart(2, "0");
    const day = String(deliveryTime.getDate()).padStart(2, "0");
    const hours = String(deliveryTime.getHours()).padStart(2, "0");
    const minutes = String(deliveryTime.getMinutes()).padStart(2, "0");
    const seconds = String(deliveryTime.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    function validateAddress(address) {
    if (address === "") {
        throw new Error("Address is required");
    }
    return address;
    }

    async function createOrderPayload(address) {
    return {
        deliveryTime: calculateDeliveryTime(),
        address: address,
    };
    }

    async function submitOrder(payload) {
    const token = getToken();
    const response = await fetch("https://food-delivery.kreosoft.ru/api/order", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const responseData = await response.text();
        if (responseData) {
        const errorData = JSON.parse(responseData);
        throw new Error(errorData.message || "Failed to place order");
        }
        throw new Error("Failed to place order. Empty response received.");
    }
    return response.text();
    }

    async function handleOrderSuccess() {
    console.log("Order placed successfully");
    window.location.href = "../html/order.html";
    }

    async function handleOrderError(error) {
    console.log("Error placing order:", error);
    // You could add user-facing error handling here
    }

    async function sendDishesToOrder(event) {
    event.preventDefault();
    try {
        const address = await validateAddress(
        document.getElementById("address-input").value.trim()
        );
        const payload = await createOrderPayload(address);
        await submitOrder(payload);
        await handleOrderSuccess();
    } catch (error) {
        await handleOrderError(error);
    }
    }

    // Initialize
    const orderButton = document.getElementById("orderButton");
    orderButton.addEventListener("click", sendDishesToOrder);

    fetchCartItems();

    function logout() {
    fetch("https://food-delivery.kreosoft.ru/api/account/logout", {
        method: "POST",
    })
        .then((response) => {
        window.location.href = "../../index.html";
        })
        .catch((error) => {
        console.error("Logout failed:", error);
        });
    }

    function createNewOrder() {
    window.location.href = "../html/createOrder.html";
    }
