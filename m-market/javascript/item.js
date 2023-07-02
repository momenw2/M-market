    const apiUrl = 'https://food-delivery.kreosoft.ru/api/dish/';

    function displayItem(itemId) {
    fetch(apiUrl + itemId)
        .then(response => response.json())
        .then(item => {
        console.log('Data from API:', item);

        const dishDiv = document.getElementById('dish');

        const dishImg = document.createElement('img');
        dishImg.src = item.image;
        dishImg.alt = item.name;
        dishDiv.appendChild(dishImg);

        const dishName = document.createElement('h2');
        dishName.textContent = item.name;
        dishDiv.appendChild(dishName);

        const dishDescription = document.createElement('p');
        dishDescription.textContent = item.description;
        dishDiv.appendChild(dishDescription);

        const dishPrice = document.createElement('p');
        dishPrice.textContent = `Price: ${item.price} ${item.currency}`;
        dishDiv.appendChild(dishPrice);

        const addButton = document.createElement('button');
        addButton.textContent = 'Add to cart';
        addButton.addEventListener('click', () => {
            const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            currency: item.currency
            };
            // Add the cart item to the cart array and store it in local storage or on the server
        });
        dishDiv.appendChild(addButton);
        })
        .catch(error => {
        console.log('Error fetching data:', error);
        });
    }

    // Call the displayItem function with the ID of the item you want to display
    displayItem('3fa85f64-5717-4562-b3fc-2c963f66afa6');
