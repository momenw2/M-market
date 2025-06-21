    const apiUrl =
    "https://food-delivery.kreosoft.ru/api/dish?vegetarian=false&page=1";
    const itemsPerPage = 10; // set the number of items to display per page
    let currentPage = 1;

    class Dish {
    constructor({ id, name, description, price, currency, image }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.currency = currency;
        this.image = image;
    }

    getFormattedPrice() {
        return `Price: ${this.price} ${this.currency}`;
    }
    }

    class CartItem {
    constructor({ id, name, price, currency }) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.currency = currency;
    }
    }
    v;

    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        console.log("Data from API:", data);

        const dishesDiv = document.getElementById("dishes");
        const paginationDiv = document.getElementById("pagination");

        let currentRow = null;
        let itemCount = 0;
        const totalItems = data.dishes.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        function displayPage(pageNumber) {
        dishesDiv.innerHTML = "";
        currentRow = null;
        let itemCount = 0;

        data.dishes.forEach((dish, index) => {
            if (
            index >= (pageNumber - 1) * itemsPerPage &&
            itemCount < itemsPerPage
            ) {
            const dishItem = new Dish(dish);
            renderDish(dishItem, index);
            itemCount++;
            }
        });
        }

        function renderDish(dish, index) {
        if (index % 2 === 0) {
            currentRow = document.createElement("div");
            currentRow.classList.add("row");
            dishesDiv.appendChild(currentRow);
        }

        const dishDiv = createDishCard(dish);
        currentRow.appendChild(dishDiv);
        }

        function createDishCard(dish) {
        const dishDiv = document.createElement("div");
        dishDiv.classList.add("dish");

        const dishImg = document.createElement("img");
        dishImg.src = dish.image;
        dishImg.alt = dish.name;
        dishDiv.appendChild(dishImg);

        const dishName = document.createElement("h2");
        dishName.textContent = dish.name;
        dishDiv.appendChild(dishName);

        const dishDescription = document.createElement("p");
        dishDescription.textContent = dish.description;
        dishDiv.appendChild(dishDescription);

        const dishPrice = document.createElement("p");
        dishPrice.textContent = dish.getFormattedPrice();
        dishDiv.appendChild(dishPrice);

        const addButton = document.createElement("button");
        addButton.textContent = "Add to cart";
        addButton.classList.add("addToCart");
        addButton.addEventListener("click", () => {
            const cartItem = new CartItem(dish);
        });

        dishDiv.appendChild(addButton);
        return dishDiv;
        }

        displayPage(currentPage);
    })
    .catch((error) => {
        console.log("Error fetching data:", error);
    });
