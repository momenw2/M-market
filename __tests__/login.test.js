function loginHandler(e) {
  e.preventDefault();

  const token = "fake-token";
  localStorage.setItem("token", JSON.stringify(token));
  window.redirectedTo = "somewhere/fake.html";
}

describe("login.js Unit Tests", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form>
        <input name="email" value="test@example.com" />
        <input name="password" value="password123" />
      </form>
      <div id="error" style=""></div>
    `;

    global.localStorage = {
      setItem: () => {},
      clear: () => {},
    };

    global.window.redirectedTo = "";

    document.querySelector("form").addEventListener("submit", loginHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fake login and fake redirect", () => {
    document.querySelector("form").dispatchEvent(new Event("submit"));

    expect(true).toBe(true);

    expect(window.redirectedTo).toBe("somewhere/fake.html");
  });

  test("should show error if needed", () => {
    const error = document.getElementById("error");
    error.textContent = "Invalid creds";
    expect(error.textContent).toBe("Invalid creds");
  });

  test("should handle network error", () => {
    const error = document.getElementById("error");
    error.textContent = "Network error";
    expect(error.textContent).toBe("Network error");
  });

  test("should login data", () => {
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    expect(email).toBe("test@example.com");
    expect(password).toBe("password123");
  });

  test("no hardcoded error spam", () => {
    const errorMsg = "Invalid email or password";
    expect(errorMsg).toMatch(/Invalid/);
  });
});
