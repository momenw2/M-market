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
      // Changed from 'item'
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

// const cartUrl = "https://food-delivery.kreosoft.ru/api/basket";
// const totalPriceElement = document.getElementById("total-price");

// // let totalPriceElement;

// // function ensureElementsExist() {
// //   if (!totalPriceElement) {
// //     totalPriceElement = document.getElementById("total-price") || {
// //       textContent: "",
// //       style: {},
// //     };
// //   }
// // }

// // Function to retrieve the token from the profile endpoint
// async function retrieveToken() {
//   try {
//     const response = await fetch(
//       "https://food-delivery.kreosoft.ru/api/account/profile",
//       {
//         headers: {
//           Accept: "text/plain",
//         },
//       }
//     );

//     if (response.ok) {
//       const token = await response.text();
//       localStorage.setItem("token", JSON.stringify(token));
//       return token;
//     } else {
//       throw new Error("Failed to retrieve token");
//     }
//   } catch (error) {
//     console.log("Error retrieving token:", error);
//   }
// }

// // Function to get the token from storage or fetch a new token
// async function getToken() {
//   let token = JSON.parse(localStorage.getItem("token"));

//   if (!token) {
//     token = await retrieveToken();
//   }

//   return token;
// }

// // Fetch cart items and calculate total price
// async function fetchCartItems() {
//   try {
//     const token = await getToken();

//     const response = await fetch(cartUrl, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log("Cart items:", data);

//       const cartItemsDiv = document.getElementById("cart-items");
//       let totalPrice = 0; // Initialize total price

//       // Create an array to hold the promises
//       const promises = [];

//       data.forEach((item, index) => {
//         console.log("Item price:", item.price);
//         console.log("Item quantity:", item.quantity);

//         const cartItemDiv = document.createElement("div");
//         cartItemDiv.classList.add("cart-item");

//         const itemImage = document.createElement("img");
//         itemImage.src = item.image;
//         itemImage.alt = item.name;
//         cartItemDiv.appendChild(itemImage);

//         const itemName = document.createElement("span");
//         itemName.textContent = item.name;
//         cartItemDiv.appendChild(itemName);

//         const increaseButton = document.createElement("button");
//         increaseButton.textContent = "+";
//         increaseButton.classList.add("quantity-button");
//         increaseButton.addEventListener("click", () =>
//           updateCartItemQuantity(item.id, true)
//         );
//         cartItemDiv.appendChild(increaseButton);

//         const itemQuantity = document.createElement("span");
//         itemQuantity.id = `quantity-${item.id}`;
//         itemQuantity.classList.add("item-quantity"); // Add the class "item-quantity"

//         // Retrieve the quantity from local storage or set it to 1 if not stored
//         const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
//         const quantity = cartItems[item.id] || 1;

//         itemQuantity.textContent = quantity.toString();
//         cartItemDiv.appendChild(itemQuantity);

//         const decreaseButton = document.createElement("button");
//         decreaseButton.textContent = "-";
//         decreaseButton.classList.add("quantity-button");
//         decreaseButton.addEventListener("click", () =>
//           updateCartItemQuantity(item.id, false)
//         );
//         cartItemDiv.appendChild(decreaseButton);

//         const itemPrice = document.createElement("span");
//         itemPrice.setAttribute("data-price", item.price);
//         itemPrice.textContent =
//           item.price !== undefined ? `${item.price} ₽` : "Price not available";
//         itemPrice.classList.add("item-price");
//         cartItemDiv.appendChild(document.createTextNode(" "));
//         cartItemDiv.appendChild(itemPrice);

//         const deleteButton = document.createElement("button");
//         deleteButton.textContent = "Delete";
//         deleteButton.classList.add("delete-button");
//         deleteButton.addEventListener("click", () =>
//           deleteCartItem(item.id, cartItemDiv)
//         );
//         cartItemDiv.appendChild(deleteButton);

//         cartItemsDiv.appendChild(cartItemDiv);

//         // Create a promise for each API call and add it to the array
//         const promise = Promise.resolve({ quantity })
//           .then((data) => {
//             console.log("Item quantity:", data.quantity);
//             if (
//               typeof item.price === "number" &&
//               typeof data.quantity === "number"
//             ) {
//               const itemTotalPrice = item.price * data.quantity;
//               totalPrice += itemTotalPrice; // Add item price to total price
//               itemPrice.textContent = `${itemTotalPrice.toFixed(2)} ₽`; // Update the item price in the DOM
//             }
//           })
//           .catch((error) => {
//             console.log("Error fetching item quantity:", error);
//             totalPriceElement.textContent = "Error calculating total price"; // Display error message in the total price element
//           });

//         promises.push(promise);
//       });

//       // Wait for all promises to resolve
//       Promise.all(promises)
//         .then(() => {
//           console.log("Total Price:", totalPrice);
//           totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(
//             2
//           )} ₽`; // Display total price in the total price element
//           localStorage.setItem(
//             "totalPrice",
//             JSON.stringify(totalPrice.toFixed(2))
//           ); // Save the total price to local storage
//         })
//         .catch((error) => {
//           console.log("Error calculating total price:", error);
//           totalPriceElement.textContent = "Error calculating total price"; // Display error message in the total price element
//         });
//     } else {
//       throw new Error("Failed to fetch cart items");
//     }
//   } catch (error) {
//     console.log("Error fetching cart items:", error);
//     totalPriceElement.textContent = "Error fetching cart items"; // Display error message in the total price element
//   }
// }

// // Function to update the quantity of a cart item locally
// function updateCartItemQuantity(itemId, increase) {
//   const itemQuantityElement = document.getElementById(`quantity-${itemId}`);
//   let quantity = parseInt(itemQuantityElement.textContent);

//   if (increase) {
//     quantity += 1;
//   } else {
//     if (quantity > 1) {
//       quantity -= 1;
//     }
//   }

//   itemQuantityElement.textContent = quantity.toString();

//   // Update the quantity in local storage
//   const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
//   cartItems[itemId] = quantity;
//   localStorage.setItem("cartItems", JSON.stringify(cartItems));

//   // Recalculate total price
//   calculateTotalPrice();
// }

// // Function to calculate the total price
// function calculateTotalPrice() {
//   const cartItems = document.getElementsByClassName("cart-item");
//   let totalPrice = 0;

//   for (let i = 0; i < cartItems.length; i++) {
//     const item = cartItems[i];
//     const itemPriceElement = item.querySelector("span[data-price]");
//     const itemQuantity = parseInt(
//       item.querySelector(`span[id^=quantity-]`).textContent
//     );
//     const itemPrice = parseFloat(itemPriceElement.getAttribute("data-price"));

//     if (!isNaN(itemQuantity) && !isNaN(itemPrice)) {
//       const itemTotalPrice = itemPrice * itemQuantity;
//       totalPrice += itemTotalPrice;
//       itemPriceElement.textContent = `${itemTotalPrice.toFixed(2)} ₽`;
//     }
//   }

//   totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} ₽`;
//   localStorage.setItem("totalPrice", JSON.stringify(totalPrice.toFixed(2))); // Save the updated total price to local storage
// }

// // Function to delete a cart item
// async function deleteCartItem(itemId, cartItemDiv) {
//   try {
//     const deleteUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}`;
//     const token = await getToken();

//     const response = await fetch(deleteUrl, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       },
//     });

//     if (response.ok) {
//       cartItemDiv.remove(); // Remove the cart item from the DOM
//       calculateTotalPrice(); // Recalculate total price
//     } else {
//       throw new Error("Failed to delete cart item");
//     }
//   } catch (error) {
//     console.log("Error deleting cart item:", error);
//   }
// }

// // Event listener to fetch cart items and calculate total price when the page loads
// window.addEventListener("DOMContentLoaded", fetchCartItems);

// function logout() {
//   fetch("https://food-delivery.kreosoft.ru/api/account/logout", {
//     method: "POST",
//   })
//     .then((response) => {
//       window.location.href = "../../index.html";
//     })
//     .catch((error) => {
//       console.error("Logout failed:", error);
//     });
// }

// function createNewOrder() {
//   window.location.href = "../html/createOrder.html";
// }

// module.exports = {
//   fetchCartItems,
//   calculateTotalPrice,
//   updateCartItemQuantity,
//   deleteCartItem,
// };
