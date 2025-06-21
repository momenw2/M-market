    const dishId = window.location.hash.substr(1); // Retrieve the dish ID from the URL

    const apiUrl = `https://food-delivery.kreosoft.ru/api/dish/${dishId}`;

    class Dish {
    constructor({ name, description, price, image }) {
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
        const dish = new Dish(data);
        displayDishDetails(dish);
    })
    .catch(handleDishError);

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
        data.price !== undefined ? data.price + ' ₽' : getUnavailableText()
    }`;

    dishImg.src = image;
    dishImg.alt = name;
    dishImg.addEventListener("load", () => dishImg.classList.add("loaded"));
    }

    function getUnavailableText() {
    return "Price not available";
    }

    function logout() {
    fetch("https://food-delivery.kreosoft.ru/api/account/logout", {
        method: "POST",
    })
        .then((response) => {
        window.location.href = "../../index.html";
        })
        .catch((error) => {
        console.error("Logout failed:", error);
        });
    }
