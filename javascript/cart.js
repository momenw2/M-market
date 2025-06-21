const cartUrl = "https://food-delivery.kreosoft.ru/api/basket";

let totalPriceElement;

function ensureElementsExist() {
  if (!totalPriceElement) {
    totalPriceElement = document.getElementById("total-price") || {
      textContent: "",
      style: {},
    };
  }
}

async function retrieveToken() {
  try {
    const response = await fetch(
      "https://food-delivery.kreosoft.ru/api/account/profile",
      {
        headers: {
          Accept: "text/plain",
        },
      }
    );

    if (response.ok) {
      const token = await response.text();
      localStorage.setItem("token", JSON.stringify(token));
      return token;
    } else {
      throw new Error(`Failed to retrieve token: ${response.status}`);
    }
  } catch (error) {
    console.log("Error retrieving token:", error);
    throw error;
  }
}

async function getToken() {
  let token = JSON.parse(localStorage.getItem("token"));

  if (!token) {
    token = await retrieveToken();
  }

  return token;
}
function createCartItemElement(cartItem) {
  const cartItemDiv = document.createElement("div");
  cartItemDiv.classList.add("cart-item");

  const itemImage = document.createElement("img");
  itemImage.src = item.image;
  itemImage.alt = item.name;
  cartItemDiv.appendChild(itemImage);

  const itemName = document.createElement("span");
  itemName.textContent = item.name;
  cartItemDiv.appendChild(itemName);

  addQuantityControls(parent, cartItem);

  const itemPrice = document.createElement("span");
  itemPrice.setAttribute("data-price", item.price);
  itemPrice.classList.add("item-price");
  cartItemDiv.appendChild(document.createTextNode(" "));
  cartItemDiv.appendChild(itemPrice);

  addDeleteButton(parent, cartItem);

  return cartItemDiv;
}

function addQuantityControls(parent, item) {
  const increaseButton = document.createElement("button");
  increaseButton.textContent = "+";
  increaseButton.classList.add("quantity-button");
  increaseButton.addEventListener("click", () =>
    updateCartItemQuantity(item.id, true)
  );
  parent.appendChild(increaseButton);

  const itemQuantity = document.createElement("span");
  itemQuantity.id = `quantity-${item.id}`;
  itemQuantity.classList.add("item-quantity");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
  const quantity = cartItems[item.id] || 1;
  itemQuantity.textContent = quantity.toString();
  parent.appendChild(itemQuantity);

  const decreaseButton = document.createElement("button");
  decreaseButton.textContent = "-";
  decreaseButton.classList.add("quantity-button");
  decreaseButton.addEventListener("click", () =>
    updateCartItemQuantity(item.id, false)
  );
  parent.appendChild(decreaseButton);
}

function addDeleteButton(parent, item) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => deleteCartItem(item.id, parent));
  parent.appendChild(deleteButton);
}

async function fetchCartItems() {
  try {
    ensureElementsExist();
    const token = await getToken();

    const response = await fetch(cartUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cartItems = await response.json(); // Changed from 'data'
    console.log("Cart items:", cartItems);

    const cartItemsContainer = document.getElementById("cart-items"); // More specific name
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;

    cartItems.forEach((cartItem) => {
      const cartItemElement = createCartItemElement(cartItem); // More specific name
      cartItemsContainer.appendChild(cartItemElement);

      if (typeof cartItem.price === "number") {
        const quantity =
          JSON.parse(localStorage.getItem("cartItems"))?.[cartItem.id] || 1;
        const itemTotalPrice = cartItem.price * quantity;
        totalPrice += itemTotalPrice;
        cartItemElement.querySelector(
          ".item-price"
        ).textContent = `${itemTotalPrice.toFixed(2)} ₽`;
      }
    });

    ensureElementsExist();
    totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} ₽`;
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice.toFixed(2)));
  } catch (error) {
    console.log("Error fetching cart items:", error);
    ensureElementsExist();
    totalPriceElement.textContent = `Error fetching cart items: ${error.message}`;
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
};