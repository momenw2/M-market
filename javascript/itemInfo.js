    const dishId = window.location.hash.substr(1); // Retrieve the dish ID from the URL

    const apiUrl = `https://food-delivery.kreosoft.ru/api/dish/${dishId}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log('Dish details:', data);
        displayDishDetails(data);
    })
    .catch(handleDishError);

    function displayDishDetails(data) {
    const {
        name,
        description,
        price,
        image
    } = data;

    const dishName = document.getElementById('dish-name');
    const dishDescription = document.getElementById('dish-description');
    const dishPrice = document.getElementById('dish-price');
    const dishImg = document.getElementById('dish-img');

    dishName.textContent = name;
    dishDescription.textContent = description;
    dishPrice.textContent = `Price: ${price !== undefined ? price + ' ₽' : getUnavailableText()}`;

    dishImg.src = image;
    dishImg.alt = name;
    dishImg.addEventListener('load', () => dishImg.classList.add('loaded'));
    }




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