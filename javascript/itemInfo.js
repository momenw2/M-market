const dishId = window.location.hash.substr(1); // Retrieve the dish ID from the URL

const apiUrl = `https://food-delivery.kreosoft.ru/api/dish/${dishId}`;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log('Dish details:', data);

        // Access the necessary DOM elements in the dish.html file
        const dishDetailsDiv = document.getElementById('dish-details');
        const dishImg = document.getElementById('dish-img');

        // Create and append elements to display the dish details
        const dishName = document.getElementById('dish-name');
        const dishDescription = document.getElementById('dish-description');
        const dishPrice = document.getElementById('dish-price');

        dishImg.addEventListener('load', () => {
            dishImg.classList.add('loaded'); // Add the loaded class to display the image
        });

        dishName.textContent = data.name;
        dishDescription.textContent = data.description;
        dishPrice.textContent = `Price: ${data.price !== undefined ? data.price + ' ₽' : 'Price not available'}`;

        dishImg.src = data.image;
        dishImg.alt = data.name;

    })
    .catch(error => {
        console.log('Error fetching dish details:', error);
    });



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