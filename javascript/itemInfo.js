const urlParams = new URLSearchParams(window.location.search);
const dishId = urlParams.get('id');

    const apiUrl = `https://food-delivery.kreosoft.ru/api/dish/${dishId}`;

    class Dish {
    constructor({ name, description, price, image }) {
        if (!name || !description || !image) {
        throw new Error("Invalid dish data");
        }
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
    }

    getFormattedPrice() {
        return this.price !== undefined ? `${this.price} ₽` : getUnavailableText();
    }
    }

    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        try {
        const dish = new Dish(data);
        displayDishDetails(dish);
        } catch (error) {
        handleDishError(error);
        }
    });

    function displayDishDetails(data) {
    const { name, description, price, image } = data;

    dishName.textContent = dish.name;
    dishDescription.textContent = dish.description;
    dishPrice.textContent = `Price: ${dish.getFormattedPrice()}`;
    dishImg.src = dish.image;
    dishImg.alt = dish.name;

    dishName.textContent = name;
    dishDescription.textContent = description;
    dishPrice.textContent = `Price: ${
        data.price !== undefined ? data.price + " ₽" : getUnavailableText()
    }`;

    dishImg.src = image;
    dishImg.alt = name;
    dishImg.addEventListener("load", () => dishImg.classList.add("loaded"));
    }

    function getUnavailableText() {
    return "Price not available";
    }

    function handleDishError(error) {
    console.error("Error fetching dish details:", error);
    const errorContainer = document.getElementById("error-message");
    if (errorContainer) {
        errorContainer.textContent =
        "Failed to load dish details. Please try again later.";
        errorContainer.style.color = "red";
    }
    }

    fetch("https://food-delivery.kreosoft.ru/api/account/logout", {
    method: "POST",
    })
    .then(() => {
        window.location.href = "../../index.html";
    })
    .catch((error) => {
        console.error("Logout failed:", error);
    });
