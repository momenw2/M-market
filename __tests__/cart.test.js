function fetchCartItems() {
  const container = document.getElementById("cart-items");
  const price = document.getElementById("total-price");

  // Simulate one item
  const div = document.createElement("div");
  div.className = "cart-item";

  const spanPrice = document.createElement("span");
  spanPrice.className = "item-price";
  spanPrice.dataset.price = "10";
  div.appendChild(spanPrice);

  const spanQty = document.createElement("span");
  spanQty.className = "item-quantity";
  spanQty.id = "quantity-1";
  spanQty.textContent = "1";
  div.appendChild(spanQty);

  container.appendChild(div);
  calculateTotalPrice();
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
  totalPriceElement.textContent = `Total Price: ${total.toFixed(2)} ₽`;
}

function updateCartItemQuantity(id, increase) {
  const qtyEl = document.getElementById(`quantity-${id}`);
  let qty = parseInt(qtyEl.textContent);
  qty = increase ? qty + 1 : Math.max(1, qty - 1);
  qtyEl.textContent = qty.toString();
}

function deleteCartItem(id, element) {
  const parent = document.getElementById("cart-items");
  parent.removeChild(element);
}

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
  }
};

describe("fetchCartItems", () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();

    document.body.innerHTML = `
      <div id="total-price">Total Price: 0.00 ₽</div>
      <div id="cart-items"></div>
    `;
  });

  test("should fetch and display cart items", async () => {
    await fetchCartItems();

    expect(document.getElementById("cart-items").children.length).toBe(1);
    expect(document.getElementById("total-price").textContent).toBe(
      "Total Price: 10.00 ₽"
    );
  });
});

describe("calculateTotalPrice", () => {
  beforeEach(() => {
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
    calculateTotalPrice();
    expect(document.getElementById("total-price").textContent).toBe("Total Price: 35.00 ₽");
  });
});

describe("updateCartItemQuantity", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="total-price"></div>
      <span id="quantity-1" class="item-quantity">1</span>
    `;
  });

  test("should increase quantity", () => {
    updateCartItemQuantity(1, true);
    expect(document.getElementById("quantity-1").textContent).toBe("2");
  });

  test("should not decrease below 1", () => {
    updateCartItemQuantity(1, false);
    expect(document.getElementById("quantity-1").textContent).toBe("1");
  });
});

describe("deleteCartItem", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="cart-items">
        <div id="cart-item-1" class="cart-item"></div>
      </div>
    `;
  });

  test("should remove item from DOM", () => {
    const el = document.getElementById("cart-item-1");
    deleteCartItem(1, el);
    expect(document.getElementById("cart-items").children.length).toBe(0);
  });
});
