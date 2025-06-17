const cartUrl = 'https://food-delivery.kreosoft.ru/api/basket';
const totalPriceElement = document.getElementById('total-price');

// Function to retrieve the token from the profile endpoint
async function retrieveToken() {
  try {
    const response = await fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
      headers: {
        'Accept': 'text/plain'
      }
    });

    if (response.ok) {
      const token = await response.text();
      localStorage.setItem('token', JSON.stringify(token));
      return token;
    } else {
      throw new Error('Failed to retrieve token');
    }
  } catch (error) {
    console.log('Error retrieving token:', error);
  }
}

// Function to get the token from storage or fetch a new token
async function getToken() {
  let token = JSON.parse(localStorage.getItem('token'));

  if (!token) {
    token = await retrieveToken();
  }

  return token;
}

// Fetch cart items and calculate total price
async function fetchCartItems() {
  try {
    const token = await getToken();

    const response = await fetch(cartUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Cart items:', data);

      const cartItemsDiv = document.getElementById('cart-items');
      let totalPrice = 0; // Initialize total price

      // Create an array to hold the promises
      const promises = [];

      data.forEach((item, index) => {
        console.log('Item price:', item.price);
        console.log('Item quantity:', item.quantity);

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.alt = item.name;
        cartItemDiv.appendChild(itemImage);

        const itemName = document.createElement('span');
        itemName.textContent = item.name;
        cartItemDiv.appendChild(itemName);

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.classList.add('quantity-button');
        increaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, true));
        cartItemDiv.appendChild(increaseButton);

        const itemQuantity = document.createElement('span');
        itemQuantity.id = `quantity-${item.id}`;
        itemQuantity.classList.add('item-quantity'); // Add the class "item-quantity"

        // Retrieve the quantity from local storage or set it to 1 if not stored
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
        const quantity = cartItems[item.id] || 1;

        itemQuantity.textContent = quantity.toString();
        cartItemDiv.appendChild(itemQuantity);

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.classList.add('quantity-button');
        decreaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, false));
        cartItemDiv.appendChild(decreaseButton);

        const itemPrice = document.createElement('span');
        itemPrice.setAttribute('data-price', item.price);
        itemPrice.textContent = item.price !== undefined ? `${item.price} ₽` : 'Price not available';
        itemPrice.classList.add('item-price');
        cartItemDiv.appendChild(document.createTextNode(' '));
        cartItemDiv.appendChild(itemPrice);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deleteCartItem(item.id, cartItemDiv));
        cartItemDiv.appendChild(deleteButton);

        cartItemsDiv.appendChild(cartItemDiv);

        // Create a promise for each API call and add it to the array
        const promise = Promise.resolve({ quantity })
          .then(data => {
            console.log('Item quantity:', data.quantity);
            if (typeof item.price === 'number' && typeof data.quantity === 'number') {
              const itemTotalPrice = item.price * data.quantity;
              totalPrice += itemTotalPrice; // Add item price to total price
              itemPrice.textContent = `${itemTotalPrice.toFixed(2)} ₽`; // Update the item price in the DOM
            }
          })
          .catch(error => {
            console.log('Error fetching item quantity:', error);
            totalPriceElement.textContent = 'Error calculating total price'; // Display error message in the total price element
          });

        promises.push(promise);
      });

      // Wait for all promises to resolve
      Promise.all(promises)
        .then(() => {
          console.log('Total Price:', totalPrice);
          totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} ₽`; // Display total price in the total price element
          localStorage.setItem('totalPrice', JSON.stringify(totalPrice.toFixed(2))); // Save the total price to local storage
        })
        .catch(error => {
          console.log('Error calculating total price:', error);
          totalPriceElement.textContent = 'Error calculating total price'; // Display error message in the total price element
        });
    } else {
      throw new Error('Failed to fetch cart items');
    }
  } catch (error) {
    console.log('Error fetching cart items:', error);
    totalPriceElement.textContent = 'Error fetching cart items'; // Display error message in the total price element
  }
}

// Function to update the quantity of a cart item locally
function updateCartItemQuantity(itemId, increase) {
  const itemQuantityElement = document.getElementById(`quantity-${itemId}`);
  let quantity = parseInt(itemQuantityElement.textContent);

  if (increase) {
    quantity += 1;
  } else {
    if (quantity > 1) {
      quantity -= 1;
    }
  }

  itemQuantityElement.textContent = quantity.toString();

  // Update the quantity in local storage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
  cartItems[itemId] = quantity;
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  // Recalculate total price
  calculateTotalPrice();
}

// Function to calculate the total price
function calculateTotalPrice() {
  const cartItems = document.getElementsByClassName('cart-item');
  let totalPrice = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const itemPriceElement = item.querySelector('span[data-price]');
    const itemQuantity = parseInt(item.querySelector(`span[id^=quantity-]`).textContent);
    const itemPrice = parseFloat(itemPriceElement.getAttribute('data-price'));

    if (!isNaN(itemQuantity) && !isNaN(itemPrice)) {
      const itemTotalPrice = itemPrice * itemQuantity;
      totalPrice += itemTotalPrice;
      itemPriceElement.textContent = `${itemTotalPrice.toFixed(2)} ₽`;
    }
  }

  totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} ₽`;
  localStorage.setItem('totalPrice', JSON.stringify(totalPrice.toFixed(2))); // Save the updated total price to local storage
}

// Function to delete a cart item
async function deleteCartItem(itemId, cartItemDiv) {
  try {
    const deleteUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}`;
    const token = await getToken();

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      cartItemDiv.remove(); // Remove the cart item from the DOM
      calculateTotalPrice(); // Recalculate total price
    } else {
      throw new Error('Failed to delete cart item');
    }
  } catch (error) {
    console.log('Error deleting cart item:', error);
  }
}

// Event listener to fetch cart items and calculate total price when the page loads
window.addEventListener('DOMContentLoaded', fetchCartItems);









// const cartUrl = 'https://food-delivery.kreosoft.ru/api/basket';
// const totalPriceElement = document.getElementById('total-price');

// // Function to retrieve the token from the profile endpoint
// async function retrieveToken() {
//   try {
//     const response = await fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
//       headers: {
//         'Accept': 'text/plain'
//       }
//     });

//     if (response.ok) {
//       const token = await response.text();
//       localStorage.setItem('token', JSON.stringify(token));
//       return token;
//     } else {
//       throw new Error('Failed to retrieve token');
//     }
//   } catch (error) {
//     console.log('Error retrieving token:', error);
//   }
// }

// // Function to get the token from storage or fetch a new token
// async function getToken() {
//   let token = JSON.parse(localStorage.getItem('token'));

//   if (!token) {
//     token = await retrieveToken();
//   }

//   return token;
// }

// // Fetch cart items and calculate total price
// async function fetchCartItems() {
//   try {
//     const token = await getToken();

//     const response = await fetch(cartUrl, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json'
//       }
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log('Cart items:', data);

//       const cartItemsDiv = document.getElementById('cart-items');
//       let totalPrice = 0; // Initialize total price

//       // Create an array to hold the promises
//       const promises = [];

//       data.forEach((item, index) => {
//         console.log('Item price:', item.price);
//         console.log('Item quantity:', item.quantity);

//         const cartItemDiv = document.createElement('div');
//         cartItemDiv.classList.add('cart-item');

//         const itemImage = document.createElement('img');
//         itemImage.src = item.image;
//         itemImage.alt = item.name;
//         cartItemDiv.appendChild(itemImage);

//         const itemName = document.createElement('span');
//         itemName.textContent = item.name;
//         cartItemDiv.appendChild(itemName);
        

//         const increaseButton = document.createElement('button');
//         increaseButton.textContent = '+';
//         increaseButton.classList.add('quantity-button');
//         increaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, true));
//         cartItemDiv.appendChild(increaseButton);

//         // const itemQuantity = document.createElement('span');
//         // itemQuantity.id = `quantity-${item.id}`;
//         // itemQuantity.textContent = item.quantity !== undefined ? item.quantity : '1'; // Set the default quantity to 1 if undefined
//         // cartItemDiv.appendChild(itemQuantity);

//         const itemQuantity = document.createElement('span');
//         itemQuantity.id = `quantity-${item.id}`;
//         itemQuantity.textContent = item.quantity !== undefined ? item.quantity : '1';
//         itemQuantity.classList.add('item-quantity'); // Add the class "item-quantity"
//         cartItemDiv.appendChild(itemQuantity);


//         const decreaseButton = document.createElement('button');
//         decreaseButton.textContent = '-';
//         decreaseButton.classList.add('quantity-button');
//         decreaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, false));
//         cartItemDiv.appendChild(decreaseButton);


//         // const itemPrice = document.createElement('span');
//         // itemPrice.setAttribute('data-price', item.price); // Set the data-price attribute
//         // itemPrice.textContent = item.price !== undefined ? `${item.price} ₽` : 'Price not available';
//         // cartItemDiv.appendChild(document.createTextNode(' ')); // Add a space
//         // cartItemDiv.appendChild(itemPrice);



//         const itemPrice = document.createElement('span');
//         itemPrice.setAttribute('data-price', item.price);
//         itemPrice.textContent = item.price !== undefined ? `${item.price} ₽` : 'Price not available';
//         itemPrice.classList.add('item-price');
//         cartItemDiv.appendChild(document.createTextNode(' '));
//         cartItemDiv.appendChild(itemPrice);








//         const deleteButton = document.createElement('button');
//         deleteButton.textContent = 'Delete';
//         deleteButton.classList.add('delete-button');
//         deleteButton.addEventListener('click', () => deleteCartItem(item.id, cartItemDiv));
//         cartItemDiv.appendChild(deleteButton);

//         cartItemsDiv.appendChild(cartItemDiv);

//         // Create a promise for each API call and add it to the array
//         const promise = Promise.resolve({ quantity: item.quantity || 1 })
//           .then(data => {
//             console.log('Item quantity:', data.quantity);
//             if (typeof item.price === 'number' && typeof data.quantity === 'number') {
//               const itemTotalPrice = item.price * data.quantity;
//               totalPrice += itemTotalPrice; // Add item price to total price
//               itemPrice.textContent = `${itemTotalPrice.toFixed(2)} ₽`; // Update the item price in the DOM
//             }
//           })
//           .catch(error => {
//             console.log('Error fetching item quantity:', error);
//             totalPriceElement.textContent = 'Error calculating total price'; // Display error message in the total price element
//           });

//         promises.push(promise);
//       });

//       // Wait for all promises to resolve
//       Promise.all(promises)
//         .then(() => {
//           console.log('Total Price:', totalPrice);
//           totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} ₽`; // Display total price in the total price element
//           localStorage.setItem('totalPrice', JSON.stringify(totalPrice.toFixed(2))); // Save the total price to local storage
//         })
//         .catch(error => {
//           console.log('Error calculating total price:', error);
//           totalPriceElement.textContent = 'Error calculating total price'; // Display error message in the total price element
//         });
//     } else {
//       throw new Error('Failed to fetch cart items');
//     }
//   } catch (error) {
//     console.log('Error fetching cart items:', error);
//     totalPriceElement.textContent = 'Error fetching cart items'; // Display error message in the total price element
//   }
// }

// // Function to update the quantity of a cart item locally
// function updateCartItemQuantity(itemId, increase) {
//   const itemQuantityElement = document.getElementById(`quantity-${itemId}`);
//   let quantity = parseInt(itemQuantityElement.textContent);

//   if (increase) {
//     quantity += 1;
//   } else {
//     if (quantity > 1) {
//       quantity -= 1;
//     }
//   }

//   itemQuantityElement.textContent = quantity.toString();

//   // Recalculate total price
//   calculateTotalPrice();
// }

// // Function to calculate the total price
// function calculateTotalPrice() {
//   const cartItems = document.getElementsByClassName('cart-item');
//   let totalPrice = 0;

//   for (let i = 0; i < cartItems.length; i++) {
//     const item = cartItems[i];
//     const itemPriceElement = item.querySelector('span[data-price]');
//     const itemQuantity = parseInt(item.querySelector(`span[id^=quantity-]`).textContent);
//     const itemPrice = parseFloat(itemPriceElement.getAttribute('data-price'));

//     if (!isNaN(itemQuantity) && !isNaN(itemPrice)) {
//       const itemTotalPrice = itemPrice * itemQuantity;
//       totalPrice += itemTotalPrice;
//       itemPriceElement.textContent = `${itemTotalPrice.toFixed(2)} ₽`;
//     }
//   }

//   totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} ₽`;
//   localStorage.setItem('totalPrice', JSON.stringify(totalPrice.toFixed(2))); // Save the updated total price to local storage
// }

// // Function to delete a cart item
// async function deleteCartItem(itemId, cartItemDiv) {
//   try {
//     const deleteUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}`;

//     const token = await getToken();

//     const response = await fetch(deleteUrl, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json'
//       }
//     });

//     if (response.ok) {
//       cartItemDiv.remove();
//       calculateTotalPrice(); // Recalculate total price
//     } else {
//       throw new Error('Failed to delete cart item');
//     }
//   } catch (error) {
//     console.log('Error deleting cart item:', error);
//     totalPriceElement.textContent = 'Error deleting cart item'; // Display error message in the total price element
//   }
// }

// // Function to logout
// function logout() {
//   localStorage.removeItem('token');
//   localStorage.removeItem('totalPrice');
//   window.location.href = '../html/login.html';
// }

// // Load total price from local storage if available
// const savedTotalPrice = JSON.parse(localStorage.getItem('totalPrice'));
// if (savedTotalPrice) {
//   totalPriceElement.textContent = `Total Price: ${savedTotalPrice} ₽`;
// }

// fetchCartItems(); // Fetch cart items and calculate total price









//     const cartUrl = 'https://food-delivery.kreosoft.ru/api/basket';
//     const totalPriceElement = document.getElementById('total-price');

//     // Function to retrieve the token from the profile endpoint
//     async function retrieveToken() {
//     try {
//         const response = await fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
//         headers: {
//             'Accept': 'text/plain'
//         }
//         });

//         if (response.ok) {
//         const token = await response.text();
//         localStorage.setItem('token', JSON.stringify(token));
//         return token;
//         } else {
//         throw new Error('Failed to retrieve token');
//         }
//     } catch (error) {
//         console.log('Error retrieving token:', error);
//     }
//     }

//     // Function to get the token from storage or fetch a new token
//     async function getToken() {
//     let token = JSON.parse(localStorage.getItem('token'));

//     if (!token) {
//         token = await retrieveToken();
//     }

//     return token;
//     }

//     // Fetch cart items and calculate total price
//     async function fetchCartItems() {
//     try {
//         const token = await getToken();

//         const response = await fetch(cartUrl, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//         }
//         });

//         if (response.ok) {
//         const data = await response.json();
//         console.log('Cart items:', data);

//         const cartItemsDiv = document.getElementById('cart-items');
//         let totalPrice = 0; // Initialize total price

//         // Create an array to hold the promises
//         const promises = [];

//         data.forEach((item, index) => {
//             console.log('Item price:', item.price);
//             console.log('Item quantity:', item.quantity);

//             const cartItemDiv = document.createElement('div');
// cartItemDiv.classList.add('cart-item');

// const itemImage = document.createElement('img');
// itemImage.src = item.image;
// itemImage.alt = item.name;
// cartItemDiv.appendChild(itemImage);

// const itemName = document.createElement('span');
// itemName.textContent = item.name;
// cartItemDiv.appendChild(itemName);

// const itemPrice = document.createElement('span');
// itemPrice.setAttribute('data-price', item.price); // Set the data-price attribute
// itemPrice.textContent = item.price !== undefined ? `${item.price} ₽` : 'Price not available';
// cartItemDiv.appendChild(itemPrice);

// const increaseButton = document.createElement('button');
// increaseButton.textContent = '+';
// increaseButton.classList.add('quantity-button');
// increaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, true));
// cartItemDiv.appendChild(increaseButton);

// const itemQuantity = document.createElement('span');
// itemQuantity.id = `quantity-${item.id}`;
// itemQuantity.textContent = item.quantity !== undefined ? item.quantity : '1'; // Set the default quantity to 1 if undefined
// cartItemDiv.appendChild(itemQuantity);

// const decreaseButton = document.createElement('button');
// decreaseButton.textContent = '-';
// decreaseButton.classList.add('quantity-button');
// decreaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, false));
// cartItemDiv.appendChild(decreaseButton);

// const deleteButton = document.createElement('button');
// deleteButton.textContent = 'Delete';
// deleteButton.classList.add('delete-button');
// deleteButton.addEventListener('click', () => deleteCartItem(item.id, cartItemDiv));
// cartItemDiv.appendChild(deleteButton);

// cartItemsDiv.appendChild(cartItemDiv);

            


//             // Create a promise for each API call and add it to the array
//             const promise = Promise.resolve({ quantity: item.quantity || 1 })
//             .then(data => {
//                 console.log('Item quantity:', data.quantity);
//                 if (typeof item.price === 'number' && typeof data.quantity === 'number') {
//                 const itemTotalPrice = item.price * data.quantity;
//                 totalPrice += itemTotalPrice; // Add item price to total price
//                 itemPrice.textContent = ` - Price: ${itemTotalPrice.toFixed(2)} ₽`; // Update the item price in the DOM
//                 }
//             })
//             .catch(error => {
//                 console.log('Error fetching item quantity:', error);
//                 totalPriceElement.textContent = 'Error calculating total price'; // Display error message in the total price element
//             });

//             promises.push(promise);
//         });

//         // Wait for all promises to resolve
//         Promise.all(promises)
//             .then(() => {
//             console.log('Total Price:', totalPrice);
//             totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} ₽`; // Display total price in the total price element
//             localStorage.setItem('totalPrice', JSON.stringify(totalPrice.toFixed(2))); // Save the total price to local storage
//             })
//             .catch(error => {
//             console.log('Error calculating total price:', error);
//             totalPriceElement.textContent = 'Error calculating total price'; // Display error message in the total price element
//             });
//         } else {
//         throw new Error('Failed to fetch cart items');
//         }
//     } catch (error) {
//         console.log('Error fetching cart items:', error);
//         totalPriceElement.textContent = 'Error fetching cart items'; // Display error message in the total price element
//     }
//     }

//     // Function to update the quantity of a cart item locally
//     function updateCartItemQuantity(itemId, increase) {
//     const itemQuantityElement = document.getElementById(`quantity-${itemId}`);
//     let quantity = parseInt(itemQuantityElement.textContent);

//     if (increase) {
//         quantity += 1;
//     } else {
//         if (quantity > 1) {
//         quantity -= 1;
//         }
//     }

//     itemQuantityElement.textContent = quantity.toString();

//     // Recalculate total price
//     calculateTotalPrice();
//     }

//    // Function to calculate the total price
// function calculateTotalPrice() {
//     const cartItems = document.getElementsByClassName('cart-item');
//     let totalPrice = 0;
    
//         for (let i = 0; i < cartItems.length; i++) {
//         const item = cartItems[i];
//         const itemPriceElement = item.querySelector('span[data-price]');
//         const itemQuantity = parseInt(item.querySelector(`span[id^=quantity-]`).textContent);
//         const itemPrice = parseFloat(itemPriceElement.getAttribute('data-price'));
    
//         if (!isNaN(itemQuantity) && !isNaN(itemPrice)) {
//             const itemTotalPrice = itemPrice * itemQuantity;
//             totalPrice += itemTotalPrice;
//             itemPriceElement.textContent = ` - Price: ${itemTotalPrice.toFixed(2)} ₽`;
//         }
//         }
    
//         totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} ₽`;
//         localStorage.setItem('totalPrice', JSON.stringify(totalPrice.toFixed(2))); // Save the updated total price to local storage
//     }
    

//     // Function to delete a cart item
//     async function deleteCartItem(itemId, cartItemDiv) {
//     try {
//         const deleteUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}`;

//         const token = await getToken();

//         const response = await fetch(deleteUrl, {
//         method: 'DELETE',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//         }
//         });

//         if (response.ok) {
//         cartItemDiv.remove();
//         calculateTotalPrice(); // Recalculate total price
//         } else {
//         throw new Error('Failed to delete cart item');
//         }
//     } catch (error) {
//         console.log('Error deleting cart item:', error);
//         totalPriceElement.textContent = 'Error deleting cart item'; // Display error message in the total price element
//     }
//     }

//     // Function to logout
//     function logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('totalPrice');
//     window.location.href = '../html/login.html';
//     }

//     // Load total price from local storage if available
// const savedTotalPrice = JSON.parse(localStorage.getItem('totalPrice'));
// if (savedTotalPrice) {
// totalPriceElement.textContent = `Total Price: ${savedTotalPrice} ₽`;
// }

// fetchCartItems(); // Fetch cart items and calculate total price






// const cartUrl = 'https://food-delivery.kreosoft.ru/api/basket';
//     const totalPriceElement = document.getElementById('total-price');

//     // Get the token from storage
//     const token = JSON.parse(localStorage.getItem('token'));

//     fetch(cartUrl, {
//     headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json'
//     }
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Cart items:', data);

//         const cartItemsDiv = document.getElementById('cart-items');
//         let totalPrice = 0; // Initialize total price

//         // Create an array to hold the promises
//         const promises = [];

//         data.forEach((item, index) => {
//         console.log('Item price:', item.price);
//         console.log('Item quantity:', item.quantity);

//         const cartItemDiv = document.createElement('div');
//         cartItemDiv.classList.add('cart-item');

//         const itemImage = document.createElement('img');
//         itemImage.src = item.image;
//         itemImage.alt = item.name;
//         cartItemDiv.appendChild(itemImage);

//         const itemName = document.createElement('span');
//         itemName.textContent = item.name;
//         cartItemDiv.appendChild(itemName);

//         const itemQuantity = document.createElement('span');
//         itemQuantity.id = `quantity-${item.id}`;
//         itemQuantity.textContent = item.quantity !== undefined ? item.quantity : '1'; // Set the default quantity to 1 if undefined
//         cartItemDiv.appendChild(itemQuantity);

//         const itemPrice = document.createElement('span');
//         itemPrice.textContent = ` - Price: ${item.price !== undefined ? item.price + ' ₽' : 'Price not available'}`;
//         cartItemDiv.appendChild(itemPrice);

//         const increaseButton = document.createElement('button');
//         increaseButton.textContent = '+';
//         increaseButton.classList.add('quantity-button');
//         increaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, true));
//         cartItemDiv.appendChild(increaseButton);

//         const decreaseButton = document.createElement('button');
//         decreaseButton.textContent = '-';
//         decreaseButton.classList.add('quantity-button');
//         decreaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, false));
//         cartItemDiv.appendChild(decreaseButton);

//         const deleteButton = document.createElement('button');
//         deleteButton.textContent = 'Delete';
//         deleteButton.classList.add('delete-button');
//         deleteButton.addEventListener('click', () => deleteCartItem(item.id, cartItemDiv));
//         cartItemDiv.appendChild(deleteButton);

//         cartItemsDiv.appendChild(cartItemDiv);

//         // Create a promise for each API call and add it to the array
//         const promise = Promise.resolve({ quantity: item.quantity || 1 })
//             .then(data => {
//             console.log('Item quantity:', data.quantity);
//             if (typeof item.price === 'number' && typeof data.quantity === 'number') {
//                 totalPrice += item.price * data.quantity; // Add item price to total price
//             }
//             })
//             .catch(error => {
//             console.log('Error fetching item quantity:', error);
//             totalPriceElement.textContent = 'Error calculating total price'; // Display error message in the total price element
//             });

//         promises.push(promise);
//         });

//         // Wait for all promises to resolve
//         Promise.all(promises)
//         .then(() => {
//             console.log('Total Price:', totalPrice);
//             totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} ₽`; // Display total price in the total price element
//         })
//         .catch(error => {
//             console.log('Error calculating total price:', error);
//             totalPriceElement.textContent = 'Error calculating total price'; // Display error message in the total price element
//         });
//     })
//     .catch(error => {
//         console.log('Error fetching cart items:', error);
//         totalPriceElement.textContent = 'Error fetching cart items'; // Display error message in the total price element
//     });

//     function updateCartItemQuantity(itemId, increase) {
//     const updateUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}`;
//     const method = increase ? 'PATCH' : 'DELETE';

//     fetch(updateUrl, {
//         method: method,
//         headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json'
//         }
//     })
//         .then(response => {
//         if (response.ok) {
//             console.log('Item quantity updated successfully');
//             return response.json(); // Parse the response as JSON
//         } else {
//             throw new Error('Failed to update item quantity');
//         }
//         })
//         .then(data => {
//         const itemQuantity = document.getElementById(`quantity-${itemId}`);
//         const updatedQuantity = increase ? data.quantity + 1 : data.quantity - 1;
//         itemQuantity.textContent = updatedQuantity;
//         })
//         .catch(error => {
//         console.log('Error updating item quantity:', error);
//         });
//     }

//     function deleteCartItem(itemId, cartItemDiv) {
//     const deleteUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}`;

//     fetch(deleteUrl, {
//         method: 'DELETE',
//         headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json'
//         }
//     })
//         .then(response => {
//         if (response.ok) {
//             console.log('Item deleted successfully');
//             cartItemDiv.remove(); // Remove the cart item from the DOM
//         } else {
//             throw new Error('Failed to delete item');
//         }
//         })
//         .catch(error => {
//         console.log('Error deleting item:', error);
//         });
//     }

    
    
    
    
    
    //     const cartUrl = 'https://food-delivery.kreosoft.ru/api/basket';

    // // Get the token from storage
    // const token = JSON.parse(localStorage.getItem('token'));

    // fetch(cartUrl, {
    // headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Accept': 'application/json'
    // }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Cart items:', data);

    //     const cartItemsDiv = document.getElementById('cart-items');

    //     data.forEach((item, index) => {
    //     const cartItemDiv = document.createElement('div');
    //     cartItemDiv.classList.add('cart-item');

    //     const itemImage = document.createElement('img');
    //     itemImage.src = item.image;
    //     itemImage.alt = item.name;
    //     cartItemDiv.appendChild(itemImage);

    //     const itemNumber = document.createElement('span');
    //     itemNumber.textContent = `${index + 1}. `;
    //     cartItemDiv.appendChild(itemNumber);

    //     const itemName = document.createElement('span');
    //     itemName.textContent = item.name;
    //     cartItemDiv.appendChild(itemName);

    //     const itemPrice = document.createElement('span');
    //     itemPrice.textContent = ` - Price: ${item.price !== undefined ? item.price + ' ₽' : 'Price not available'}`;
    //     cartItemDiv.appendChild(itemPrice);

    //     const increaseButton = document.createElement('button');
    //     increaseButton.textContent = '+';
    //     increaseButton.classList.add('quantity-button');
    //     increaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, true));
    //     cartItemDiv.appendChild(increaseButton);

    //     const decreaseButton = document.createElement('button');
    //     decreaseButton.textContent = '-';
    //     decreaseButton.classList.add('quantity-button');
    //     decreaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, false));
    //     cartItemDiv.appendChild(decreaseButton);

    //     cartItemsDiv.appendChild(cartItemDiv);

    //     // Add a horizontal line after each item
    //     if (index !== data.length - 1) {
    //         const line = document.createElement('hr');
    //         cartItemsDiv.appendChild(line);
    //     }
    //     });
    // })
    // .catch(error => {
    //     console.log('Error fetching cart items:', error);
    // });

    // function updateCartItemQuantity(itemId, increase) {
    // const updateUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}?increase=${increase}`;

    // fetch(updateUrl, {
    //     method: 'DELETE',
    //     headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Accept': 'application/json'
    //     }
    // })
    //     .then(response => {
    //     if (response.ok) {
    //         console.log('Item quantity updated successfully');
    //         // Handle the response or update the cart UI accordingly
    //     } else {
    //         throw new Error('Failed to update item quantity');
    //     }
    //     })
    //     .catch(error => {
    //     console.log('Error updating item quantity:', error);
    //     // Handle the error or display an error message
    //     });
    // }










// const cartUrl = 'https://food-delivery.kreosoft.ru/api/basket';
// const token = JSON.parse(localStorage.getItem('token'));

// fetch(cartUrl, {
//     headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json'
//     }
// })
// .then(response => response.json())
// .then(data => {
//     console.log('Cart items:', data);

//     const cartItemsDiv = document.getElementById('cart-items');

//     data.forEach((item, index) => {
//         const cartItemDiv = document.createElement('div');
//         cartItemDiv.classList.add('cart-item');
//         cartItemDiv.id = `cart-item-${item.id}`;

//         const itemImage = document.createElement('img');
//         itemImage.src = item.image;
//         itemImage.alt = item.name;
//         cartItemDiv.appendChild(itemImage);

//         const itemNumber = document.createElement('span');
//         itemNumber.textContent = `${index + 1}. `;
//         cartItemDiv.appendChild(itemNumber);

//         const itemName = document.createElement('span');
//         itemName.textContent = item.name;
//         cartItemDiv.appendChild(itemName);

//         const itemQuantity = document.createElement('span');
//         itemQuantity.textContent = ` - Quantity: ${item.quantity}`;
//         cartItemDiv.appendChild(itemQuantity);

//         const itemPrice = document.createElement('span');
//         itemPrice.textContent = ` - Price: ${item.price !== undefined ? item.price + ' ₽' : 'Price not available'}`;
//         cartItemDiv.appendChild(itemPrice);

//         const increaseButton = document.createElement('button');
//         increaseButton.textContent = '+';
//         increaseButton.classList.add('quantity-button');
//         increaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, true));
//         cartItemDiv.appendChild(increaseButton);

//         const decreaseButton = document.createElement('button');
//         decreaseButton.textContent = '-';
//         decreaseButton.classList.add('quantity-button');
//         decreaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, false));
//         cartItemDiv.appendChild(decreaseButton);

//         const deleteButton = document.createElement('button');
//         deleteButton.textContent = 'Delete';
//         deleteButton.classList.add('delete-button');
//         deleteButton.addEventListener('click', () => deleteCartItem(item.id, cartItemDiv));
//         cartItemDiv.appendChild(deleteButton);

//         cartItemsDiv.appendChild(cartItemDiv);

//         if (index !== data.length - 1) {
//             const line = document.createElement('hr');
//             line.id = `line-${item.id}`;
//             cartItemsDiv.appendChild(line);
//         }
//     });
// })
// .catch(error => {
//     console.log('Error fetching cart items:', error);
// });

// function updateCartItemQuantity(itemId, increase) {
//     const updateUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}?increase=${increase}`;

//     fetch(updateUrl, {
//         method: 'DELETE',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//         }
//     })
//         .then(response => {
//             if (response.ok) {
//                 console.log('Item quantity updated successfully');
//             } else {
//                 throw new Error('Failed to update item quantity');
//             }
//         })
//         .catch(error => {
//             console.log('Error updating item quantity:', error);
//         });
// }

// function deleteCartItem(itemId, cartItemDiv) {
//     const deleteUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}`;

//     fetch(deleteUrl, {
//         method: 'DELETE',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//         }
//     })
//         .then(response => {
//             if (response.ok) {
//                 console.log('Item deleted successfully');
//                 cartItemDiv.remove();
//                 const line = document.getElementById(`line-${itemId}`);
//                 if (line) {
//                     line.remove();
//                 }
//             } else {
//                 throw new Error('Failed to delete item');
//             }
//         })
//         .catch(error => {
//             console.log('Error deleting item:', error);
//         });
// }


// const cartUrl = 'https://food-delivery.kreosoft.ru/api/basket';

// // Get the token from storage
// const token = JSON.parse(localStorage.getItem('token'));

// fetch(cartUrl, {
// headers: {
//     'Authorization': `Bearer ${token}`,
//     'Accept': 'application/json'
// }
// })
// .then(response => response.json())
// .then(data => {
//     console.log('Cart items:', data);

//     const cartItemsDiv = document.getElementById('cart-items');

//     data.forEach((item, index) => {
//     const cartItemDiv = document.createElement('div');
//     cartItemDiv.classList.add('cart-item');

//     const itemImage = document.createElement('img');
//     itemImage.src = item.image;
//     itemImage.alt = item.name;
//     cartItemDiv.appendChild(itemImage);

//     const itemName = document.createElement('span');
//     itemName.textContent = item.name;
//     cartItemDiv.appendChild(itemName);

//     const itemQuantity = document.createElement('span');
//     itemQuantity.id = `quantity-${item.id}`;
//     itemQuantity.textContent = ` - Quantity: ${item.quantity}`;
//     cartItemDiv.appendChild(itemQuantity);

//     const itemPrice = document.createElement('span');
//     itemPrice.textContent = ` - Price: ${item.price !== undefined ? item.price + ' ₽' : 'Price not available'}`;
//     cartItemDiv.appendChild(itemPrice);

//     const increaseButton = document.createElement('button');
//     increaseButton.textContent = '+';
//     increaseButton.classList.add('quantity-button');
//     increaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, true));
//     cartItemDiv.appendChild(increaseButton);

//     const decreaseButton = document.createElement('button');
//     decreaseButton.textContent = '-';
//     decreaseButton.classList.add('quantity-button');
//     decreaseButton.addEventListener('click', () => updateCartItemQuantity(item.id, false));
//     cartItemDiv.appendChild(decreaseButton);

//     const deleteButton = document.createElement('button');
//     deleteButton.textContent = 'Delete';
//     deleteButton.classList.add('delete-button');
//     deleteButton.addEventListener('click', () => deleteCartItem(item.id, cartItemDiv));
//     cartItemDiv.appendChild(deleteButton);

//     cartItemsDiv.appendChild(cartItemDiv);
//     });
// })
// .catch(error => {
//     console.log('Error fetching cart items:', error);
// });

//     function updateCartItemQuantity(itemId, increase) {
//         const updateUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}?increase=${increase}`;
    
//         fetch(updateUrl, {
//         method: 'DELETE',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//         }
//         })
//         .then(response => {
//             if (response.ok) {
//             console.log('Item quantity updated successfully');
//             return response.json(); // Parse the response as JSON
//             } else {
//             throw new Error('Failed to update item quantity');
//             }
//         })
//         .then(data => {
//             const itemQuantity = document.getElementById(`quantity-${itemId}`);
//             const updatedQuantity = increase ? data.quantity + 1 : data.quantity - 1;
//             itemQuantity.textContent = ` - Quantity: ${updatedQuantity}`;
//         })
//         .catch(error => {
//             console.log('Error updating item quantity:', error);
//         });
//     }
    
    
    

// function deleteCartItem(itemId, cartItemDiv) {
// const deleteUrl = `https://food-delivery.kreosoft.ru/api/basket/dish/${itemId}`;

// fetch(deleteUrl, {
//     method: 'DELETE',
//     headers: {
//     'Authorization': `Bearer ${token}`,
//     'Accept': 'application/json'
//     }
// })
//     .then(response => {
//     if (response.ok) {
//         console.log('Item deleted successfully');
//         cartItemDiv.remove(); // Remove the cart item from the DOM
//     } else {
//         throw new Error('Failed to delete item');
//     }
//     })
//     .catch(error => {
//     console.log('Error deleting item:', error);
//     });
// }



