const apiUrl = "https://food-delivery.kreosoft.ru/api/dish/";

    function displayItem(itemId) {
    fetch(apiUrl + itemId)
        .then((response) => response.json())
        .then((item) => {
        console.log("Data from API:", item);
        renderDish(item);
        addDishToCart(item);
        })
        .catch((error) => {
        console.log("Error fetching data:", error);
        });
    }
    class CartItem {
        constructor({ id, name, price, currency }) {
            this.id = id;
            this.name = name;
            this.price = price;
            this.currency = currency;
        }

        formatPrice() {
            return `${this.price} ${this.currency}`;
        }
        }


    function renderDish(item) {
    const dishDiv = document.getElementById("dish");

    const dishImg = document.createElement("img");
    dishImg.src = item.image;
    dishImg.alt = item.name;
    dishDiv.appendChild(dishImg);

    const dishName = document.createElement("h2");
    dishName.textContent = item.name;
    dishDiv.appendChild(dishName);

    const dishDescription = document.createElement("p");
    dishDescription.textContent = item.description;
    dishDiv.appendChild(dishDescription);

    const dishPrice = document.createElement("p");
    dishPrice.textContent = `Price: ${item.price} ${item.currency}`;
    dishDiv.appendChild(dishPrice);
    }

    function addDishToCart(item) {
    const dishDiv = document.getElementById("dish");

    const addButton = document.createElement("button");
    addButton.textContent = "Add to cart";
    dishDiv.appendChild(addButton);
    }

const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");
if (itemId) displayItem(itemId);
else {
    console.error("Item ID not found in URL");
}
