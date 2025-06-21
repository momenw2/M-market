// Function to fetch and display cart items on the page
function fetchCartItems() {
  // Select the container for cart items and the element showing total price
  const container = document.getElementById("cart-items");
  const price = document.getElementById("total-price");

  // Create a new div to represent a single cart item
  const div = document.createElement("div");
  div.className = "cart-item";

  // Create a span to store the price data for this cart item
  const spanPrice = document.createElement("span");
  spanPrice.className = "item-price";
  spanPrice.dataset.price = "10"; // Price assigned here
  div.appendChild(spanPrice);

  // Create a span to display the quantity of this cart item
  const spanQty = document.createElement("span");
  spanQty.className = "item-quantity";
  spanQty.id = "quantity-1"; // Unique ID to identify this quantity span
  spanQty.textContent = "1"; // Initial quantity is 1
  div.appendChild(spanQty);

  // Add the cart item div to the container
  container.appendChild(div);

  // Recalculate and update the total price displayed
  calculateTotalPrice();
}

// Function to calculate and update the total price of all cart items
function calculateTotalPrice() {
  // Select all price and quantity elements for cart items
  const prices = document.querySelectorAll(".item-price");
  const quantities = document.querySelectorAll(".item-quantity");

  let total = 0;
  // Loop through all prices and corresponding quantities
  prices.forEach((p, i) => {
    const price = parseFloat(p.dataset.price); // Get price as number
    const qty = parseInt(quantities[i].textContent); // Get quantity as number
    total += price * qty; // Sum up total price
  });

  // Update the total price element with the calculated value, formatted to 2 decimals
  const totalPriceElement = document.getElementById("total-price");
  totalPriceElement.textContent = `Total Price: ${total.toFixed(2)} ₽`;
}

// Function to update the quantity of a specific cart item
// 'id' identifies the item, 'increase' determines if quantity goes up or down
function updateCartItemQuantity(id, increase) {
  const qtyEl = document.getElementById(`quantity-${id}`); // Select quantity element by id
  let qty = parseInt(qtyEl.textContent); // Parse current quantity
  // Increase or decrease quantity but never below 1
  qty = increase ? qty + 1 : Math.max(1, qty - 1);
  qtyEl.textContent = qty.toString(); // Update the displayed quantity
}

// Function to remove a cart item element from the DOM
function deleteCartItem(id, element) {
  const parent = document.getElementById("cart-items"); // Select the cart container
  parent.removeChild(element); // Remove the specified element
}

// Mocking global fetch and localStorage objects for tests
global.fetch = jest.fn();
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key];
  },
  setItem(key, val) {
    this.store[key] = val;
  },
  clear() {
    this.store = {};
  },
};

describe("fetchCartItems", () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();

    // Setup DOM elements before each test
    document.body.innerHTML = `
      <div id="total-price">Total Price: 0.00 ₽</div>
      <div id="cart-items"></div>
    `;
  });

  test("should fetch and display cart items", async () => {
    // Call function to add cart items to DOM
    await fetchCartItems();

    // Expect one cart item to be added
    expect(document.getElementById("cart-items").children.length).toBe(1);

    // Expect total price to reflect the item price * quantity
    expect(document.getElementById("total-price").textContent).toBe(
      "Total Price: 10.00 ₽"
    );
  });
});

describe("calculateTotalPrice", () => {
  beforeEach(() => {
    // Setup DOM with multiple cart items and quantities for testing total price calculation
    document.body.innerHTML = `
      <div id="total-price"></div>
      <div id="cart-items">
        <div class="cart-item">
          <span class="item-price" data-price="10"></span>
          <span id="quantity-1" class="item-quantity">2</span>
        </div>
        <div class="cart-item">
          <span class="item-price" data-price="5"></span>
          <span id="quantity-2" class="item-quantity">3</span>
        </div>
      </div>
    `;
  });

  test("should calculate correct total", () => {
    // Call function to calculate and update total price
    calculateTotalPrice();

    // Check that total price is correct: (10*2) + (5*3) = 35
    expect(document.getElementById("total-price").textContent).toBe(
      "Total Price: 35.00 ₽"
    );
  });
});

describe("updateCartItemQuantity", () => {
  beforeEach(() => {
    // Setup DOM with a single cart item quantity span
    document.body.innerHTML = `
      <div id="total-price"></div>
      <span id="quantity-1" class="item-quantity">1</span>
    `;
  });

  test("should increase quantity", () => {
    // Increase quantity of item 1
    updateCartItemQuantity(1, true);

    // Expect quantity text content to update to 2
    expect(document.getElementById("quantity-1").textContent).toBe("2");
  });

  test("should not decrease below 1", () => {
    // Attempt to decrease quantity below 1 (should remain at 1)
    updateCartItemQuantity(1, false);

    // Confirm quantity does not go below 1
    expect(document.getElementById("quantity-1").textContent).toBe("1");
  });
});

describe("deleteCartItem", () => {
  beforeEach(() => {
    // Setup DOM with one cart item div inside container
    document.body.innerHTML = `
      <div id="cart-items">
        <div id="cart-item-1" class="cart-item"></div>
      </div>
    `;
  });

  test("should remove item from DOM", () => {
    // Select the item element to delete
    const el = document.getElementById("cart-item-1");

    // Remove the item element from the DOM
    deleteCartItem(1, el);

    // Expect cart-items container to have no children after deletion
    expect(document.getElementById("cart-items").children.length).toBe(0);
  });
});
