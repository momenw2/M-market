require("@testing-library/jest-dom");

const localStorageMock = (function () {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
  };
})();

global.localStorage = localStorageMock;
global.fetch = jest.fn();

// Mock console.log to keep test output clean
beforeEach(() => {
  document.body.innerHTML = `
    <div id="total-price">Total Price: 0.00 ₽</div>
    <div id="cart-items"></div>
  `;

  global.totalPriceElement = document.getElementById("total-price") || {
    textContent: "",
    style: {},
  };

  global.ensureElementsExist = jest.fn(() => {
    global.totalPriceElement = document.getElementById("total-price") || {
      textContent: "",
      style: {},
    };
  });

  // Add console.log mock here
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  localStorage.clear();
  fetch.mockClear();

  // Restore console.log here
  console.log.mockRestore();
});

test("setup file", () => {
  expect(true).toBe(true);
});
