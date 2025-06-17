const { loginHandler } = require("../javascript/login");

describe("login.js Unit Tests", () => {
  beforeEach(() => {
    // Mock DOM elements
    document.body.innerHTML = `
      <form>
        <input name="email" value="test@example.com">
        <input name="password" value="password123">
      </form>
      <div id="error"></div>
    `;

    // Mock localStorage
    global.localStorage = {
      setItem: jest.fn(),
    };

    // Mock fetch
    global.fetch = jest.fn();

    // Mock window.location
    delete window.location;
    window.location = { href: "" };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for [God Function] Event Listener Contains Validation, Networking, and Error Handling
  describe("login form submission", () => {
    test("should handle successful login with token storage and redirect", async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ token: "test-token" }),
      };
      fetch.mockResolvedValue(mockResponse);

      const form = document.querySelector("form");
      const submitEvent = new Event("submit");
      form.dispatchEvent(submitEvent);

      await Promise.resolve(); // Allow promises to resolve

      expect(fetch).toHaveBeenCalledWith(
        "https://food-delivery.kreosoft.ru/api/account/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "token",
        JSON.stringify("test-token")
      );
      expect(window.location.href).toBe("../html/home2.html");
    });

    test("should handle invalid credentials with error display", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      const form = document.querySelector("form");
      const submitEvent = new Event("submit");
      form.dispatchEvent(submitEvent);

      await Promise.resolve();

      const errorDiv = document.getElementById("error");
      expect(errorDiv.textContent).toBe("Invalid email or password");
      expect(errorDiv.style.color).toBe("red");
    });

    test("should handle network errors with error display", async () => {
      fetch.mockRejectedValue(new Error("Network error"));

      const form = document.querySelector("form");
      const submitEvent = new Event("submit");
      form.dispatchEvent(submitEvent);

      await Promise.resolve();

      const errorDiv = document.getElementById("error");
      expect(errorDiv.textContent).toBe("Network error");
      expect(errorDiv.style.color).toBe("red");
    });
  });

  // Test for [Message Chains] DOM Traversal and Manipulation Without Abstraction
  test("should avoid long DOM traversal chains", () => {
    const source = loginHandler.toString();
    expect(source).not.toMatch(/document\..*\..*\..*/);
    expect(source).not.toMatch(/form\..*\..*/);
  });

  // Test for [Primitive Obsession] Login Data Sent as Plain Object
  test("should send login data as plain object", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: "test-token" }),
    });

    const form = document.querySelector("form");
    const submitEvent = new Event("submit");
    form.dispatchEvent(submitEvent);

    await Promise.resolve();

    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
      email: "test@example.com",
      password: "password123",
    });
  });

  // Test for [Duplicate Code] Commented-Out Version of the Same Login Logic
  test("should not contain duplicate commented code", () => {
    const fs = require("fs");
    const source = fs.readFileSync("./javascript/login.js", "utf8");
    const commentedBlocks = source.match(/\/\*[\s\S]*?\*\//g) || [];
    expect(commentedBlocks.length).toBeLessThan(2);
  });

  // Test for [Hardcoded String] Error Message Repeated Inline
  test("should not repeat hardcoded error messages", () => {
    const source = loginHandler.toString();
    const errorMessageCount = (source.match(/Invalid email or password/g) || [])
      .length;
    expect(errorMessageCount).toBeLessThan(2);
  });
});
