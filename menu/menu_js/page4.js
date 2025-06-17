// API URLs
const apiUrl = 'https://food-delivery.kreosoft.ru/api/dish?vegetarian=false&page=4';
const addToCartBaseUrl = 'https://food-delivery.kreosoft.ru/api/basket/dish/';

// Constants
const itemsPerPage = 10; // Set the number of items to display per page
let currentPage = 1;

// Get the token from storage
const token = JSON.parse(localStorage.getItem('token'));

// Function to create rating stars
function createRatingStars(dishId, rating) {
    const ratingDiv = document.createElement('div');
    ratingDiv.classList.add('rating');

    for (let i = 1; i <= 5; i++) {
        const starSpan = document.createElement('span');
        starSpan.textContent = i <= rating ? '★' : '☆';
        starSpan.classList.add('star');
        ratingDiv.appendChild(starSpan);

        starSpan.addEventListener('click', () => {
            setRating(dishId, i);
        });
    }

    return ratingDiv;
}

// Function to set dish rating
function setRating(dishId, rating) {
    const ratingUrl = `https://food-delivery.kreosoft.ru/api/dish/${dishId}/rating`;

    fetch(ratingUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to set rating');
            }
        })
        .then(result => {
            console.log('Rating set:', result);
            // Update the UI or perform any necessary actions
        })
        .catch(error => {
            console.log('Error setting rating:', error);
            // Handle the error or display an error message
        });
}

// Function to fetch and display dishes
function fetchDishes(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Data from API:', data);

            const dishesDiv = document.getElementById('dishes');
            const paginationDiv = document.getElementById('pagination');

            let currentRow = null;
            let displayedItems = 0;
            const totalItems = data.dishes.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            // Function to display a page
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

                        const dishRating = createRatingStars(dish.id, dish.rating !== undefined ? dish.rating : 0);
                        dishDiv.appendChild(dishRating);

                        const addButton = document.createElement('button');
                        addButton.textContent = 'Add to cart';
                        addButton.classList.add('addToCart');
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
                                        throw new Error('Failed to add item to cart');
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

            // Display the initial page
            displayPage(currentPage);
            data.dishes.forEach((dish, index) => {
                const dishImg = document.querySelectorAll('.dish img')[index];

                dishImg.addEventListener('click', () => {
                    // Redirect to the new dish.html page with the dish ID in the URL
                    window.location.href = `../../html/itemInfo.html#${dish.id}`;
                });
            });

            // Add an event listener to each dish photo
            data.dishes.forEach((dish, index) => {
                const dishImg = document.querySelectorAll('.dish img')[index];

                dishImg.addEventListener('click', () => {
                    const ratingCheckUrl = `https://food-delivery.kreosoft.ru/api/dish/${dish.id}/rating/check`;

                    fetch(ratingCheckUrl, {
                        headers: {
                            accept: 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Rating data:', data);

                            const dishRating = data.rating !== undefined ? data.rating : 'Rating not available';
                            alert(`Dish ID: ${dish.id}\nDish Rating: ${dishRating}`);
                        })
                        .catch(error => {
                            console.log('Error fetching dish rating:', error);
                        });
                });
            });

            // Event listener for logout button
            const logoutButton = document.getElementById('logoutButton');
            logoutButton.addEventListener('click', logout);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
}

// Event listener for sort select
const sortSelect = document.getElementById('sort');
sortSelect.addEventListener('change', () => {
    const selectedValue = sortSelect.value;

    // Sort dishes based on the selected value
    if (selectedValue === 'alphabetical') {
        const sortedData = {
            dishes: data.dishes.sort((a, b) => {
                return a.name.localeCompare(b.name);
            }),
            pagination: data.pagination
        };
        fetchDishes(sortedData);
    } else {
        fetchDishes(apiUrl);
    }
});

// Event listener for vegetarian toggle
const vegetarianToggle = document.getElementById('vegetarianToggle');
vegetarianToggle.addEventListener('change', () => {
    const vegetarian = vegetarianToggle.checked;
    const apiUrlWithFilters = `https://food-delivery.kreosoft.ru/api/dish?vegetarian=${vegetarian}&page=4`;
    fetchDishes(apiUrlWithFilters);

    // Hide the button with number '1' initially
    const paginationDiv = document.getElementById('pagination');
    const pageOneButton = paginationDiv.querySelector('button');
    pageOneButton.style.display = 'none';
});

// Logout function
function logout() {
    fetch('https://food-delivery.kreosoft.ru/api/account/logout', {
        method: 'POST'
    })
        .then(response => {
            window.location.href = '../../index.html';
        })
        .catch(error => {
            console.error('Logout failed:', error);
        });
}

// Initial fetch of dishes
fetchDishes(apiUrl);
