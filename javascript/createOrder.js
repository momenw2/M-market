    function getTokenFromStorage() {
    const token = JSON.parse(localStorage.getItem("token"));
    return token;
    }

    class CartItem {
    constructor({ name, image, amount, price }) {
        this.name = name;
        this.image = image;
        this.amount = amount;
        this.price = price;
    }

    getTotalPrice() {
        return this.price * this.amount;
    }
    }

    async function fetchCartItems() {
    try {
        const token = getTokenFromStorage();
        const data = await fetchCartData(token);
        renderCartItems(data);
    } catch (error) {
        console.log("Error fetching cart items:", error);
    }
    }

    async function fetchCartData(token) {
    const response = await fetch("https://food-delivery.kreosoft.ru/api/basket", {
        headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error("Failed to fetch cart items");

    return await response.json();
    }

    function renderCartItems(data) {
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

        const itemDetailsDiv = createItemDetails(item);
        cartItemDiv.appendChild(itemDetailsDiv);

        const itemTotalPrice = document.createElement("span");
        itemTotalPrice.classList.add("item-total-price");
        const totalPrice = item.price !== undefined ? item.price * item.amount : 0;
        itemTotalPrice.textContent = `${totalPrice} ₽`;
        cartItemDiv.appendChild(itemTotalPrice);

        cartItemsContainer.appendChild(cartItemDiv);
    });
    }

    function createItemDetails(item) {
    const itemDetailsDiv = document.createElement("div");
    itemDetailsDiv.classList.add("item-details");

    const itemName = document.createElement("span");
    itemName.classList.add("item-name");
    itemName.innerHTML = `<strong>${item.name}</strong>`;
    itemDetailsDiv.appendChild(itemName);

    const itemPrice = document.createElement("span");
    itemPrice.classList.add("item-price");
    itemPrice.textContent =
        item.price !== undefined ? `Price: ${item.price} ₽` : "Price not available";
    itemDetailsDiv.appendChild(itemPrice);

    const itemQuantity = document.createElement("span");
    itemQuantity.classList.add("item-quantity");
    itemQuantity.textContent = `Quantity: ${item.amount}`;
    itemDetailsDiv.appendChild(itemQuantity);

    return itemDetailsDiv;
    }

    function calculateDeliveryTime() {
    const deliveryTime = new Date(Date.now() + 60 * 60 * 1000);
    return deliveryTime.toISOString();
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
    const token = getTokenFromStorage();
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
    }

    async function sendDishesToOrder(event) {
    event.preventDefault();
    try {
        const addressInput = document.getElementById("address-input");
        const address = addressInput ? addressInput.value.trim() : "";

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
