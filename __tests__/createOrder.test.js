// Retrieves and parses the stored user token from localStorage
function getToken() {
  const token = localStorage.getItem("token"); // Get token string
  return JSON.parse(token); // Parse JSON string back to object/value
}

// Fetches cart items from the server and updates the page content
async function fetchCartItems() {
  try {
    // Fetch items (simulated here with a resolved promise returning item array)
    const items = await fetch("dummy-url").then(() =>
      Promise.resolve([
        { id: 1, name: "Dummy Item", price: 10, amount: 2, image: "dummy.jpg" },
      ])
    );

    // Select container for cart items and clear current content
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    // Iterate over each item to create and append its display elements
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "cart-item";

      // Display the item name
      const spanName = document.createElement("span");
      spanName.textContent = item.name;
      div.appendChild(spanName);

      // Display the item price, with a data attribute for price value
      const spanPrice = document.createElement("span");
      spanPrice.className = "item-price";
      spanPrice.dataset.price = item.price;
      spanPrice.textContent = `${item.price} ₽`;
      div.appendChild(spanPrice);

      // Display the quantity of this item
      const spanAmount = document.createElement("span");
      spanAmount.className = "item-quantity";
      spanAmount.textContent = item.amount;
      div.appendChild(spanAmount);

      // Add this item's container div to the overall cart container
      container.appendChild(div);
    });

    // After adding all items, update the total price displayed
    calculateTotalPrice();
  } catch (e) {
    // Log error if fetching or processing items fails
    console.log("Error fetching cart items:", e);
  }
}

// Calculates the total price based on all item prices and quantities on the page
function calculateTotalPrice() {
  const prices = document.querySelectorAll(".item-price"); // Select price elements
  const quantities = document.querySelectorAll(".item-quantity"); // Select quantity elements
  let total = 0;

  // Sum up price * quantity for each cart item
  prices.forEach((p, i) => {
    const price = parseFloat(p.dataset.price);
    const qty = parseInt(quantities[i].textContent);
    total += price * qty;
  });

  // Update total price element if it exists in the DOM
  const totalPriceElement = document.getElementById("total-price");
  if (totalPriceElement) {
    totalPriceElement.textContent = `Total Price: ${total.toFixed(2)} ₽`;
  }
}

// Calculates and returns the current timestamp in ISO format without milliseconds
function calculateDeliveryTime() {
  const d = new Date();
  return d.toISOString().split(".")[0];
}

// Sends the current order details to the server on form submission
async function sendDishesToOrder(event) {
  event.preventDefault(); // Prevent default form submission

  const addressInput = document.getElementById("address-input");
  if (!addressInput || !addressInput.value.trim()) {
    console.log("Please enter your address");
    return; // Stop if no address provided
  }

  try {
    // Send POST request to order API with address in JSON body
    const response = await fetch(
      "https://food-delivery.kreosoft.ru/api/order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addressInput.value }),
      }
    );

    // Handle non-OK responses by trying to extract an error message
    if (!response.ok) {
      const text = await response.text();
      let errorMessage = text;
      try {
        const parsed = JSON.parse(text);
        if (parsed.message) errorMessage = parsed.message;
      } catch {}

      console.log("Error placing order:", errorMessage);
      return;
    }

    // If order successful, log confirmation text
    const text = await response.text();
    console.log("Order placed successfully:", text);
  } catch (e) {
    // Log network or other errors during request
    console.log("Error placing order:", e.message);
  }
}

// Redirects the user to the order creation page
function createNewOrder() {
  window.location.href = "../html/createOrder.html";
}

// Export functions for use in other modules or tests
module.exports = {
  getToken,
  fetchCartItems,
  calculateDeliveryTime,
  sendDishesToOrder,
  createNewOrder,
};
