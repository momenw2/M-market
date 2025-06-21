function displayItem(id) {
  return fetch(`https://food-delivery.kreosoft.ru/api/dish/${id}`)
    .then((res) => res.json())
    .then((item) => {
      // Simulate DOM construction
      const dishDiv = document.getElementById("dish");
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;
      dishDiv.appendChild(img);

      const h2 = document.createElement("h2");
      h2.textContent = item.name;
      dishDiv.appendChild(h2);

      const p1 = document.createElement("p");
      p1.textContent = item.description;
      dishDiv.appendChild(p1);

      const p2 = document.createElement("p");
      p2.textContent = `Price: ${item.price} ${item.currency}`;
      dishDiv.appendChild(p2);

      const button = document.createElement("button");
      button.textContent = "Add to cart";
      button.addEventListener("click", () => {
        const cartItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          currency: item.currency,
        };
        // Normally cartItem would be used, here we just simulate creation
      });
      dishDiv.appendChild(button);
    })
    .catch((err) => {
      console.log("Error fetching data:", err);
    });
}

describe("item.js Unit Tests", () => {
  beforeEach(() => {
    // Reset fetch mock and DOM
    global.fetch = jest.fn();
    document.body.innerHTML = '<div id="dish"></div>';
    console.log = jest.fn(); // Mock console logging
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("displayItem()", () => {
    // Tests that the displayItem method correctly fetches and builds DOM nodes
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

      // Verify fetch was called with correct URL
      expect(fetch).toHaveBeenCalledWith(
        "https://food-delivery.kreosoft.ru/api/dish/test-id"
      );

      const dishDiv = document.getElementById("dish");

      // Should have 5 children: img, h2, p, p, button
      expect(dishDiv.children.length).toBe(5);
      expect(dishDiv.innerHTML).toContain(mockItem.name);
      expect(dishDiv.innerHTML).toContain(mockItem.description);
    });

    // Tests that errors from fetch are handled gracefully
    test("should handle API errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));
      await displayItem("test-id");

      expect(console.log).toHaveBeenCalledWith(
        "Error fetching data:",
        expect.any(Error)
      );
    });
  });

  // Verifies that DOM creation and event logic are separated
  test("should separate DOM construction from business logic", () => {
    const source = displayItem.toString();
    expect(source).toMatch(/addEventListener\(.*\)/);
    expect(source).not.toMatch(/createElement.*addEventListener/s);
  });

  // Checks for overly nested or chained DOM access
  test("should avoid long DOM traversal chains", () => {
    const source = displayItem.toString();
    expect(source).not.toMatch(/document\..*\..*\..*/);
    expect(source).not.toMatch(/\.children\[.*\]/);
  });

  // Simulates clicking the "Add to cart" button and ensures no error
  test("should handle cart item as plain object", async () => {
    const mockItem = {
      id: "test-id",
      name: "Test Dish",
      price: 10,
      currency: "USD",
      image: "img.jpg",
      description: "desc",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockItem),
    });

    await displayItem("test-id");

    const button = document.querySelector("button");
    const clickEvent = new Event("click");

    expect(() => button.dispatchEvent(clickEvent)).not.toThrow();
  });

  // Ensures there's no hardcoded UUID in the implementation
  test("should not use hardcoded UUID in implementation", () => {
    const source = displayItem.toString();
    expect(source).not.toMatch(/3fa85f64-5717-4562-b3fc-2c963f66afa6/);
  });
});
