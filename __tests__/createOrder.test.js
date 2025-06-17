const {
  getToken,
  fetchCartItems,
  calculateDeliveryTime,
  sendDishesToOrder,
  createNewOrder,
} = require("../javascript/createOrder");

describe("createOrder.js Unit Tests", () => {
  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };

    // Mock DOM elements
    document.body.innerHTML = `
      <div id="cart-items"></div>
      <button id="orderButton"></button>
      <input id="address-input" value="123 Main St">
    `;

    // Mock fetch
    global.fetch = jest.fn();

    // Mock console.log
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for [Invalid Naming] getToken() suggests async but it's sync
  describe("getToken()", () => {
    test("should synchronously return token from localStorage", () => {
      const mockToken = "test-token";
      localStorage.getItem.mockReturnValue(JSON.stringify(mockToken));

      const result = getToken();
      expect(result).toBe(mockToken);
      expect(localStorage.getItem).toHaveBeenCalledWith("token");
    });
  });

  // Test for [God Object] fetchCartItems does rendering, logic, and calculation
  describe("fetchCartItems()", () => {
    test("should fetch and display cart items without handling calculations", async () => {
      const mockItems = [
        {
          id: 1,
          name: "Test Item",
          price: 10,
          amount: 2,
          image: "test.jpg",
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockItems),
      });

      await fetchCartItems();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(document.getElementById("cart-items").children.length).toBe(1);
      // Verify it doesn't directly manipulate total price
      expect(document.querySelector(".item-total-price").textContent).toBe(
        "20 ₽"
      );
    });

    test("should handle API errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await fetchCartItems();
      expect(console.log).toHaveBeenCalledWith(
        "Error fetching cart items:",
        expect.any(Error)
      );
    });
  });

  // Test for [Primitive Obsession] and [Feature Envy] in calculateDeliveryTime()
  describe("calculateDeliveryTime()", () => {
    test("should return ISO format string without manual formatting", () => {
      const mockDate = new Date("2023-01-01T12:00:00Z");
      const realDate = Date;
      global.Date = jest.fn(() => mockDate);
      global.Date.now = realDate.now;

      const result = calculateDeliveryTime();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
      expect(result).not.toContain("Z"); // Verify it's not doing manual formatting

      global.Date = realDate;
    });
  });

  // Test for [Long Method] sendDishesToOrder is doing too much
  describe("sendDishesToOrder()", () => {
    test("should handle successful order placement", async () => {
      const mockResponse = { ok: true, text: () => Promise.resolve("success") };
      fetch.mockResolvedValue(mockResponse);

      const event = { preventDefault: jest.fn() };
      await sendDishesToOrder(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        "https://food-delivery.kreosoft.ru/api/order",
        expect.objectContaining({
          method: "POST",
          headers: expect.anything(),
          body: expect.stringContaining('"address":"123 Main St"'),
        })
      );
      expect(console.log).toHaveBeenCalledWith(
        "Order placed successfully:",
        "success"
      );
    });

    test("should validate address before submission", async () => {
      document.getElementById("address-input").value = "";
      const event = { preventDefault: jest.fn() };

      await sendDishesToOrder(event);
      expect(fetch).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith("Please enter your address");
    });

    test("should handle API errors with proper error messages", async () => {
      const mockError = { message: "Test error" };
      fetch.mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve(JSON.stringify(mockError)),
      });

      const event = { preventDefault: jest.fn() };
      await sendDishesToOrder(event);

      expect(console.log).toHaveBeenCalledWith(
        "Error placing order:",
        expect.stringContaining("Test error")
      );
    });
  });

  // Test for [Lazy Class] createNewOrder()
  describe("createNewOrder()", () => {
    test("should redirect to createOrder page", () => {
      delete window.location;
      window.location = { href: "" };

      createNewOrder();
      expect(window.location.href).toBe("../html/createOrder.html");
    });
  });

  // Test for [Anemic Domain Model] Cart items passed as plain JS objects
  describe("Cart Item Handling", () => {
    test("should process plain JS objects as cart items", async () => {
      const plainItem = {
        id: 2,
        name: "Plain Item",
        price: 15,
        amount: 1,
        image: "plain.jpg",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([plainItem]),
      });

      await fetchCartItems();

      const itemElement = document.querySelector(".cart-item");
      expect(itemElement).toBeInTheDocument();
      expect(itemElement.textContent).toContain("Plain Item");
    });
  });

  // Test for [Duplicate Code] Multiple Versions of fetchCartItems()
  test("should have only one implementation of fetchCartItems", () => {
    const sourceCode = require("fs").readFileSync(
      "./javascript/createOrder.js",
      "utf8"
    );
    const fetchCartItemsCount = (
      sourceCode.match(/async function fetchCartItems/g) || []
    ).length;
    expect(fetchCartItemsCount).toBe(1);
  });

  // Test for [Message Chains] DOM traversal with chained calls
  test("should avoid long DOM traversal chains", () => {
    const sourceCode = require("fs").readFileSync(
      "./javascript/createOrder.js",
      "utf8"
    );
    expect(sourceCode).not.toMatch(
      /document\.querySelector\(.*\)\.parentElement/
    );
    expect(sourceCode).not.toMatch(/\.children\[.*\]/);
  });

  // Test for [Speculative Generality] Excessive commented-out legacy logic
  test("should not contain excessive commented-out code", () => {
    const sourceCode = require("fs").readFileSync(
      "./javascript/createOrder.js",
      "utf8"
    );
    const commentedBlocks = sourceCode.match(/\/\*[\s\S]*?\*\//g) || [];
    const commentedLines = sourceCode
      .split("\n")
      .filter(
        (line) =>
          line.trim().startsWith("//") && !line.trim().startsWith("// @")
      );

    expect(commentedBlocks.length).toBeLessThan(3);
    expect(commentedLines.length).toBeLessThan(10);
  });
});
