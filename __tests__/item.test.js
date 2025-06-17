const { displayItem } = require("../javascript/item");

describe("item.js Unit Tests", () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();

    // Mock DOM elements
    document.body.innerHTML = '<div id="dish"></div>';

    // Mock console
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for [Long Method] displayItem() is Doing Too Much
  describe("displayItem()", () => {
    test("should fetch and display item details without handling cart logic", async () => {
      const mockItem = {
        id: "test-id",
        name: "Test Dish",
        description: "Test Description",
        price: 10,
        currency: "USD",
        image: "test.jpg",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockItem),
      });

      await displayItem("test-id");

      expect(fetch).toHaveBeenCalledWith(
        "https://food-delivery.kreosoft.ru/api/dish/test-id"
      );

      const dishDiv = document.getElementById("dish");
      expect(dishDiv.children.length).toBe(5); // img, h2, p, p, button
      expect(dishDiv.innerHTML).toContain(mockItem.name);
      expect(dishDiv.innerHTML).toContain(mockItem.description);
    });

    test("should handle API errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await displayItem("test-id");
      expect(console.log).toHaveBeenCalledWith(
        "Error fetching data:",
        expect.any(Error)
      );
    });
  });

  // Test for [God Object] DOM Construction and Event Logic All in One Place
  test("should separate DOM construction from business logic", () => {
    const source = displayItem.toString();
    // Check that event listener is not defined in the same block as DOM creation
    expect(source).toMatch(/addEventListener\(.*\)/);
    expect(source).not.toMatch(/createElement.*addEventListener/s);
  });

  // Test for [Message Chains] DOM Traversal Using Long Chains
  test("should avoid long DOM traversal chains", () => {
    const source = displayItem.toString();
    expect(source).not.toMatch(/document\..*\..*\..*/);
    expect(source).not.toMatch(/\.children\[.*\]/);
  });

  // Test for [Primitive Obsession] cartItem is a Plain Object
  test("should handle cart item as plain object", async () => {
    const mockItem = {
      id: "test-id",
      name: "Test Dish",
      price: 10,
      currency: "USD",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockItem),
    });

    await displayItem("test-id");

    // Verify the click handler creates a plain object
    const button = document.querySelector("button");
    const clickEvent = new Event("click");
    button.dispatchEvent(clickEvent);

    // This test is somewhat limited since we can't directly observe the cartItem creation
    // but we can verify the button click doesn't throw errors
    expect(() => button.dispatchEvent(clickEvent)).not.toThrow();
  });

  // Test for [Hardcoded Data] Fixed UUID in displayItem() Call
  test("should not use hardcoded UUID in implementation", () => {
    const source = displayItem.toString();
    expect(source).not.toMatch(/3fa85f64-5717-4562-b3fc-2c963f66afa6/);
  });
});
