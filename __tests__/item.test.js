// Function to fetch and display an item by its ID
function displayItem(id) {
  // Call the API endpoint to get dish details based on the provided id
  return fetch(`https://food-delivery.kreosoft.ru/api/dish/${id}`)
    .then((res) => res.json()) // Parse the JSON response body
    .then((item) => {
      // Select the container div where the dish info will be rendered
      const dishDiv = document.getElementById("dish");

      // Inject HTML content with dish data into the container
      // This includes an image, name, description, price, and an "Add to cart" button
      dishDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h2>${item.name}</h2>
        <p>${item.description}</p>
        <p>Price: ${item.price} ${item.currency}</p>
        <button id="add-to-cart-btn">Add to cart</button>
      `;

      // Select the "Add to cart" button by its ID
      const button = document.getElementById("add-to-cart-btn");

      // Attach a click event listener to the button
      // When clicked, it creates a cartItem object with dish details
      button.addEventListener("click", () => {
        const cartItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          currency: item.currency,
        };
        // Here you could add the cartItem to a shopping cart
      });
    })
    .catch((err) => {
      // If the fetch or JSON parsing fails, log an error to the console
      console.log("Error fetching data:", err);
    });
}

describe("item.js Unit Tests", () => {
  beforeEach(() => {
    // Mock the global fetch function to simulate API responses
    // Returns a resolved Promise with item data for all fetch calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: "dummy-id",
            name: "Dummy Dish",
            description: "Dummy Description",
            price: 0,
            currency: "USD",
            image: "dummy.jpg",
          }),
      })
    );

    // Set up a clean DOM with a single div where displayItem will render
    document.body.innerHTML = '<div id="dish"></div>';

    // Mock console.log to silence error logs during tests and to test error handling
    console.log = jest.fn();
  });

  afterEach(() => {
    // Clear mocks after each test to avoid interference between tests
    jest.clearAllMocks();
  });

  describe("displayItem()", () => {
    test("should fetch and display item details without handling cart logic", async () => {
      // Call displayItem with an id, which triggers our mocked fetch
      await displayItem("dummy-id");

      // Assert fetch was called with the expected URL
      expect(fetch).toHaveBeenCalledWith(
        "https://food-delivery.kreosoft.ru/api/dish/dummy-id"
      );

      // Select the dish container div
      const dishDiv = document.getElementById("dish");

      // Check the container has exactly 5 child elements (img, h2, p, p, button)
      expect(dishDiv.children.length).toBe(5);

      // Check that the rendered HTML contains the dish's name and description
      expect(dishDiv.innerHTML).toContain("Dummy Dish");
      expect(dishDiv.innerHTML).toContain("Dummy Description");
    });

    test("should handle API errors gracefully", async () => {
      // Mock fetch to reject the promise simulating a network error
      fetch.mockRejectedValueOnce(new Error("Network error"));

      // Call displayItem and expect it to handle the error internally
      await displayItem("dummy-id");

      // Verify that console.log was called with the error message and error object
      expect(console.log).toHaveBeenCalledWith(
        "Error fetching data:",
        expect.any(Error)
      );
    });
  });

  // Test to ensure displayItem source contains addEventListener but does not have createElement with addEventListener in same function
  test("should separate DOM construction from business logic", () => {
    const source = displayItem.toString();
    expect(source).toMatch(/addEventListener\(.*\)/); // There is an event listener in displayItem
    expect(source).not.toMatch(/createElement.*addEventListener/s); // But no createElement + addEventListener combo
  });

  // Test to ensure displayItem doesn't use overly complex chained DOM queries or children access
  test("should avoid long DOM traversal chains", () => {
    const source = displayItem.toString();
    expect(source).not.toMatch(/document\..*\..*\..*/); // No 3+ chained document property accesses
    expect(source).not.toMatch(/\.children\[.*\]/); // No direct children array indexing
  });

  // Test simulating user clicking the Add to Cart button to ensure event handler works and doesn't throw errors
  test("should handle cart item as plain object", async () => {
    await displayItem("dummy-id");

    const button = document.getElementById("add-to-cart-btn");
    const clickEvent = new Event("click");

    expect(() => button.dispatchEvent(clickEvent)).not.toThrow();
  });

  // Test to ensure no hardcoded UUID string appears in the implementation
  test("should not use hardcoded UUID in implementation", () => {
    const source = displayItem.toString();
    expect(source).not.toMatch(/3fa85f64-5717-4562-b3fc-2c963f66afa6/);
  });
});
