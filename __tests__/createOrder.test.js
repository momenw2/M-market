function getToken() {
  const token = localStorage.getItem("token");
  return JSON.parse(token);
}

async function fetchCartItems() {
  try {
    const items = await fetch("dummy-url").then(() =>
      Promise.resolve([
        { id: 1, name: "Dummy Item", price: 10, amount: 2, image: "dummy.jpg" },
      ])
    );

    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "cart-item";

      const spanName = document.createElement("span");
      spanName.textContent = item.name;
      div.appendChild(spanName);

      const spanPrice = document.createElement("span");
      spanPrice.className = "item-price";
      spanPrice.dataset.price = item.price;
      spanPrice.textContent = `${item.price} ₽`;
      div.appendChild(spanPrice);

      const spanAmount = document.createElement("span");
      spanAmount.className = "item-quantity";
      spanAmount.textContent = item.amount;
      div.appendChild(spanAmount);

      container.appendChild(div);
    });

    calculateTotalPrice();
  } catch (e) {
    console.log("Error fetching cart items:", e);
  }
}

function calculateTotalPrice() {
  const prices = document.querySelectorAll(".item-price");
  const quantities = document.querySelectorAll(".item-quantity");
  let total = 0;

  prices.forEach((p, i) => {
    const price = parseFloat(p.dataset.price);
    const qty = parseInt(quantities[i].textContent);
    total += price * qty;
  });

  const totalPriceElement = document.getElementById("total-price");
  if (totalPriceElement) {
    totalPriceElement.textContent = `Total Price: ${total.toFixed(2)} ₽`;
  }
}

function calculateDeliveryTime() {
  const d = new Date();
  return d.toISOString().split(".")[0];
}

async function sendDishesToOrder(event) {
  event.preventDefault();

  const addressInput = document.getElementById("address-input");
  if (!addressInput || !addressInput.value.trim()) {
    console.log("Please enter your address");
    return;
  }

  try {
    const response = await fetch(
      "https://food-delivery.kreosoft.ru/api/order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addressInput.value }),
      }
    );

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

    const text = await response.text();
    console.log("Order placed successfully:", text);
  } catch (e) {
    console.log("Error placing order:", e.message);
  }
}

function createNewOrder() {
  window.location.href = "../html/createOrder.html";
}

module.exports = {
  getToken,
  fetchCartItems,
  calculateDeliveryTime,
  sendDishesToOrder,
  createNewOrder,
};
