const apiUrl = 'https://food-delivery.kreosoft.ru/api/dish?vegetarian=false&page=4';
const addToCartBaseUrl = 'https://food-delivery.kreosoft.ru/api/basket/dish/';
const itemsPerPage = 10; // set the number of items to display per page
let currentPage = 1;

// Get the token from storage
const token = JSON.parse(localStorage.getItem('token'));

fetch(apiUrl)
.then(response => response.json())
.then(data => {
    console.log('Data from API:', data);

    const dishesDiv = document.getElementById('dishes');
    const paginationDiv = document.getElementById('pagination');

    let currentRow = null;
    let displayedItems = 0;
    const totalItems = data.dishes.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    function displayPage(pageNumber) {
    dishesDiv.innerHTML = '';
    currentRow = null;
    displayedItems = 0;

    data.dishes.forEach((dish, index) => {
        if (index >= (pageNumber - 1) * itemsPerPage && displayedItems < itemsPerPage) {
        if (index % 2 === 0) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            dishesDiv.appendChild(currentRow);
        }

        const dishDiv = document.createElement('div');
        dishDiv.classList.add('dish');

        const dishImg = document.createElement('img');
        dishImg.src = dish.image;
        dishImg.alt = dish.name;
        dishDiv.appendChild(dishImg);

        const dishName = document.createElement('h2');
        dishName.textContent = dish.name;
        dishDiv.appendChild(dishName);

        const dishDescription = document.createElement('p');
        dishDescription.textContent = dish.description;
        dishDiv.appendChild(dishDescription);

        const dishPrice = document.createElement('p');
        dishPrice.textContent = `Price: ${dish.price !== undefined ? dish.price + ' ₽' : 'Price not available'}`;
        dishDiv.appendChild(dishPrice);

        const addButton = document.createElement('button');
        addButton.textContent = 'Add to cart';
        addButton.classList.add('addToCart'); // Add the CSS class for styling
        addButton.addEventListener('click', () => {
            const cartItem = {
            id: dish.id,
            name: dish.name,
            price: dish.price,
            currency: dish.currency
            };

            const addToCartEndpoint = addToCartBaseUrl + dish.id;

            fetch(addToCartEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(cartItem)
            })
            .then(response => {
                console.log(response);
                if (response.ok) {
                return response.json();
                } else {
                throw new Error("Failed to add item to cart");
                }
            })
            .then(result => {
                console.log('Item added to cart:', result);
                // Handle the response or update the cart UI accordingly
            })
            .catch(error => {
                console.log('Error adding item to cart:', error);
                // Handle the error or display an error message
            });
        });
        dishDiv.appendChild(addButton);

        currentRow.appendChild(dishDiv);
        displayedItems++;
        }
    });
    }

    displayPage(currentPage);
})
.catch(error => {
    console.log('Error fetching data:', error);
});
