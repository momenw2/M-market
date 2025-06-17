const {
  fetchCartItems,
  calculateTotalPrice,
  updateCartItemQuantity,
  deleteCartItem,
} = require("../javascript/cart");

describe("fetchCartItems", () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();

    document.body.innerHTML = `
      <div id="total-price">Total Price: 0.00 ₽</div>
      <div id="cart-items"></div>
    `;

    global.ensureElementsExist = jest.fn(() => {
      global.totalPriceElement = document.getElementById("total-price") || {
        textContent: "",
        style: {},
      };
    });
  });

  test("should fetch and display cart items", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve("mock-token"),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            name: "Test Item",
            price: 10,
            quantity: 1,
            image: "test.jpg",
          },
        ]),
    });

    localStorage.setItem("cartItems", JSON.stringify({ 1: 1 }));

    await fetchCartItems();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(document.getElementById("cart-items").children.length).toBe(1);
    expect(document.getElementById("total-price").textContent).toBe(
      "Total Price: 10.00 ₽"
    );
  });

  test("should handle API errors", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    document.body.innerHTML = `
      <div id="total-price"></div>
      <div id="cart-items"></div>
    `;

    global.totalPriceElement = document.getElementById("total-price");
    global.ensureElementsExist();

    try {
      await fetchCartItems();
    } catch (error) {
      expect(error).toBeDefined();
      expect(totalPriceElement.textContent).toMatch(
        /Error fetching cart items/
      );
    }
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

    global.totalPriceElement = document.getElementById("total-price");
    global.ensureElementsExist = jest.fn(() => {
      global.totalPriceElement = document.getElementById("total-price") || {
        textContent: "",
        style: {},
      };
    });
    global.ensureElementsExist();
  });

  test("should calculate correct total", () => {
    calculateTotalPrice();
    expect(totalPriceElement.textContent).toBe("Total Price: 35.00 ₽");
  });
});

describe("updateCartItemQuantity", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="total-price"></div>
      <div id="quantity-1">1</div>
    `;
    global.totalPriceElement = document.getElementById("total-price");
    global.ensureElementsExist();
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
      <div id="total-price"></div>
      <div id="cart-items">
        <div id="cart-item-1" class="cart-item"></div>
      </div>
    `;
    global.totalPriceElement = document.getElementById("total-price");
    global.ensureElementsExist();
  });

  test("should remove item from DOM", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve("mock-token"),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const itemDiv = document.getElementById("cart-item-1");
    await deleteCartItem(1, itemDiv);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(document.getElementById("cart-items").children.length).toBe(0);
  });
});
cd /Users/momenwael/Desktop/MAIN/Projects/m-market
git init