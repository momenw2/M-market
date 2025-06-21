const cartUrl = "https://food-delivery.kreosoft.ru/api/basket";

class CartService {
  constructor() {
    this.totalPriceElement = document.getElementById("total-price") || {
      textContent: "",
      style: {},
    };
  }

  async fetchWithAuth(url, options = {}) {
    const token = await this.getToken();
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  }

  async getToken() {
    let token = JSON.parse(localStorage.getItem("token"));
    if (!token) token = await this.retrieveToken();
    return token;
  }

  async retrieveToken() {
    const response = await fetch(
      "https://food-delivery.kreosoft.ru/api/account/profile",
      { headers: { Accept: "text/plain" } }
    );
    if (!response.ok)
      throw new Error(`Failed to retrieve token: ${response.status}`);
    const token = await response.text();
    localStorage.setItem("token", JSON.stringify(token));
    return token;
  }

  updateLocalQuantity(itemId, newQuantity) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    cartItems[itemId] = newQuantity;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    return cartItems;
  }

  getCurrentQuantity(itemId) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    return cartItems[itemId] || 1;
  }

  async updateItemQuantity(itemId, increase) {
    const current = this.getCurrentQuantity(itemId);
    const newQuantity = increase ? current + 1 : Math.max(1, current - 1);
    this.updateLocalQuantity(itemId, newQuantity);
    return newQuantity;
  }
}

const cartService = new CartService();

function createCartItemElement(cartItem) {
  const cartItemDiv = document.createElement("div");
  cartItemDiv.classList.add("cart-item");

  const itemImage = document.createElement("img");
  itemImage.src = cartItem.image;
  itemImage.alt = cartItem.name;
  cartItemDiv.appendChild(itemImage);

  const itemName = document.createElement("span");
  itemName.textContent = cartItem.name;
  cartItemDiv.appendChild(itemName);

  addQuantityControls(cartItemDiv, cartItem);

  const itemPrice = document.createElement("span");
  itemPrice.setAttribute("data-price", cartItem.price);
  itemPrice.classList.add("item-price");
  cartItemDiv.appendChild(document.createTextNode(" "));
  cartItemDiv.appendChild(itemPrice);

  addDeleteButton(cartItemDiv, cartItem);

  return cartItemDiv;
}

function addQuantityControls(parent, cartItem) {
  const increaseButton = document.createElement("button");
  increaseButton.textContent = "+";
  increaseButton.classList.add("quantity-button");
  increaseButton.addEventListener("click", () =>
    updateCartItemQuantity(cartItem.id, true)
  );
  parent.appendChild(increaseButton);

  const itemQuantity = document.createElement("span");
  itemQuantity.id = `quantity-${cartItem.id}`;
  itemQuantity.classList.add("item-quantity");
  itemQuantity.textContent = cartService
    .getCurrentQuantity(cartItem.id)
    .toString();
  parent.appendChild(itemQuantity);

  const decreaseButton = document.createElement("button");
  decreaseButton.textContent = "-";
  decreaseButton.classList.add("quantity-button");
  decreaseButton.addEventListener("click", () =>
    updateCartItemQuantity(cartItem.id, false)
  );
  parent.appendChild(decreaseButton);
}

function addDeleteButton(parent, cartItem) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () =>
    deleteCartItem(cartItem.id, parent)
  );
  parent.appendChild(deleteButton);
}

async function fetchCartItems() {
  try {
    const response = await cartService.fetchWithAuth(cartUrl);
    const cartItems = await response.json();
    console.log("Cart items:", cartItems);

    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;

    cartItems.forEach((cartItem) => {
      const cartItemElement = createCartItemElement(cartItem);
      cartItemsContainer.appendChild(cartItemElement);

      if (typeof cartItem.price === "number") {
        const quantity = cartService.getCurrentQuantity(cartItem.id);
        const itemTotalPrice = cartItem.price * quantity;
        totalPrice += itemTotalPrice;
        cartItemElement.querySelector(
          ".item-price"
        ).textContent = `${itemTotalPrice.toFixed(2)} ₽`;
      }
    });

    cartService.totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(
      2
    )} ₽`;
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice.toFixed(2)));
  } catch (error) {
    console.log("Error fetching cart items:", error);
    cartService.totalPriceElement.textContent = `Error fetching cart items: ${error.message}`;
    if (process.env.NODE_ENV === "test") {
      throw error;
    }
  }
}

function updateCartItemQuantity(itemId, increase) {
  cartService.updateItemQuantity(itemId, increase).then((newQuantity) => {
    document.getElementById(`quantity-${itemId}`).textContent = newQuantity;
    calculateTotalPrice();
  });
}

function calculateTotalPrice() {
  let totalPrice = 0;
  Array.from(document.getElementsByClassName("cart-item")).forEach((item) => {
    const priceElement = CartDOMHelper.getPriceElement(item);
    const quantityElement = item.querySelector(`span[id^=quantity-]`);

    if (itemPriceElement && itemQuantityElement) {
      const itemPrice = parseFloat(itemPriceElement.getAttribute("data-price"));
      const itemQuantity = parseInt(itemQuantityElement.textContent);

      if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
        const itemTotalPrice = itemPrice * itemQuantity;
        totalPrice += itemTotalPrice;
        itemPriceElement.textContent = `${itemTotalPrice.toFixed(2)} ₽`;
      }
    }
  });

  cartService.totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(
    2
  )} ₽`;
  localStorage.setItem("totalPrice", JSON.stringify(totalPrice.toFixed(2)));
  cartService.updateTotalPrice(totalPrice);
}

async function deleteCartItem(itemId, cartItemDiv) {
  try {
    const deleteUrl = `${cartUrl}/dish/${itemId}`;
    await cartService.fetchWithAuth(deleteUrl, { method: "DELETE" });
    cartItemDiv.remove();
    calculateTotalPrice();
  } catch (error) {
    console.log("Error deleting cart item:", error);
    cartService.totalPriceElement.textContent = `Error deleting item: ${error.message}`;
    if (process.env.NODE_ENV === "test") {
      throw error;
    }
  }
}

window.addEventListener("DOMContentLoaded", fetchCartItems);

function logout() {
  fetch("https://food-delivery.kreosoft.ru/api/account/logout", {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "../../index.html";
      } else {
        console.error("Logout failed with status:", response.status);
      }
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
}

function createNewOrder() {
  window.location.href = "../html/createOrder.html";
}

module.exports = {
  fetchCartItems,
  calculateTotalPrice,
  updateCartItemQuantity,
  deleteCartItem,
  CartService,
};
