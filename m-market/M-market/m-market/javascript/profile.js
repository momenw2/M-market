const url = "https://food-delivery.kreosoft.ru/api/account/profile";
const token = JSON.parse(localStorage.getItem('token'));

// Function to toggle between displaying text and input fields
function toggleEditFields() {
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const fullName = document.getElementById('fullName');
    const birthDate = document.getElementById('birthDate');
    const address = document.getElementById('address');
    const phoneNumber = document.getElementById('phoneNumber');
    const fullNameInput = document.getElementById('full-name-input');
    const birthDateInput = document.getElementById('birth-date-input');
    const addressInput = document.getElementById('address-input');
    const phoneNumberInput = document.getElementById('phone-number-input');
    const profileBox = document.querySelector('.profile-box');

    fullNameInput.value = fullName.textContent;
    birthDateInput.value = birthDate.dataset.originalValue;
    addressInput.value = address.textContent;
    phoneNumberInput.value = phoneNumber.textContent;

    fullName.classList.toggle('hidden');
    birthDate.classList.toggle('hidden');
    address.classList.toggle('hidden');
    phoneNumber.classList.toggle('hidden');
    fullNameInput.classList.toggle('hidden');
    birthDateInput.classList.toggle('hidden');
    addressInput.classList.toggle('hidden');
    phoneNumberInput.classList.toggle('hidden');

    fullNameInput.disabled = !fullNameInput.disabled;
    birthDateInput.disabled = !birthDateInput.disabled;
    addressInput.disabled = !addressInput.disabled;
    phoneNumberInput.disabled = !phoneNumberInput.disabled;

    profileBox.classList.toggle('editing');

    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
}

// Function to save the profile data to the server and refresh the page
function saveProfile() {
    const saveButton = document.getElementById('save-button');
    const editButton = document.getElementById('edit-button');
    const fullName = document.getElementById('fullName');
    const birthDate = document.getElementById('birthDate');
    const address = document.getElementById('address');
    const phoneNumber = document.getElementById('phoneNumber');
    const fullNameInput = document.getElementById('full-name-input');
    const birthDateInput = document.getElementById('birth-date-input');
    const addressInput = document.getElementById('address-input');
    const phoneNumberInput = document.getElementById('phone-number-input');

    const data = {
        fullName: fullNameInput.value,
        birthDate: birthDateInput.value,
        address: addressInput.value,
        phoneNumber: phoneNumberInput.value
    };

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    const options = {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                throw new Error('Response was not in JSON format');
            }
        })
        .then(data => {
            console.log(data); // Log the response to inspect it

            // Handle the JSON response
            if (data) {
                fullName.textContent = data.fullName;
                birthDate.dataset.originalValue = data.birthDate;
                address.textContent = data.address;
                phoneNumber.textContent = data.phoneNumber;
                fullNameInput.classList.toggle('hidden');
                birthDateInput.classList.toggle('hidden');
                addressInput.classList.toggle('hidden');
                phoneNumberInput.classList.toggle('hidden');
                fullName.classList.toggle('hidden');
                birthDate.classList.toggle('hidden');
                address.classList.toggle('hidden');
                phoneNumber.classList.toggle('hidden');
                editButton.style.display = 'inline-block';
                saveButton.style.display = 'none';

                // Redirect to profile.html
                window.location.href = 'profile.html';
            } else {
                throw new Error('Invalid JSON response');
            }
        })
        .catch(error => console.error(error));
}

// Function to fetch the user profile data from the server
function fetchProfile() {
    const id = document.getElementById('id');
    const fullName = document.getElementById('fullName');
    const birthDate = document.getElementById('birthDate');
    const gender = document.getElementById('gender');
    const address = document.getElementById('address');
    const email = document.getElementById('email');
    const phoneNumber = document.getElementById('phoneNumber');

    const headers = new Headers({
        'Authorization': `Bearer ${token}`
    });

    const options = {
        method: 'GET',
        headers
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the JSON response
            // ...

            // Check if the JSON data is valid
            if (data) {
                id.textContent = data.id;
                fullName.textContent = data.fullName;
                birthDate.dataset.originalValue = data.birthDate;

                // Convert the birth date to a Date object
                const birthDateValue = new Date(data.birthDate);

                // Extract the day, month, and year from the birth date
                const day = birthDateValue.getDate();
                const month = birthDateValue.getMonth() + 1; // Months are zero-based, so add 1
                const year = birthDateValue.getFullYear();

                // Format the birth date as "day.month.year"
                birthDate.textContent = `${day}.${month}.${year}`;

                gender.textContent = data.gender;
                address.textContent = data.address;
                email.textContent = data.email;
                phoneNumber.textContent = data.phoneNumber;
            } else {
                throw new Error('Invalid JSON response');
            }
        })
        .catch(error => console.error(error));
}


// Add event listeners to the Edit and Save buttons
const editButton = document.getElementById('edit-button');
const saveButton = document.getElementById('save-button');
editButton.addEventListener('click', toggleEditFields);
saveButton.addEventListener('click', saveProfile);

// Fetch the user profile data from the server
fetchProfile();






















// const url = "https://food-delivery.kreosoft.ru/api/account/profile";
// const token = JSON.parse(localStorage.getItem('token'));

// // Function to toggle between displaying text and input fields
// function toggleEditFields() {
//     const editButton = document.getElementById('edit-button');
//     const saveButton = document.getElementById('save-button');
//     const fullName = document.getElementById('fullName');
//     const birthDate = document.getElementById('birthDate');
//     const gender = document.getElementById('gender');
//     const address = document.getElementById('address');
//     const phoneNumber = document.getElementById('phoneNumber');
//     const fullNameInput = document.getElementById('full-name-input');
//     const birthDateInput = document.getElementById('birth-date-input');
//     const genderInput = document.getElementById('gender-input');
//     const addressInput = document.getElementById('address-input');
//     const phoneNumberInput = document.getElementById('phone-number-input');
//     const profileBox = document.querySelector('.profile-box');

//     fullNameInput.value = fullName.textContent;
//     birthDateInput.value = birthDate.textContent;
//     genderInput.value = gender.textContent;
//     addressInput.value = address.textContent;
//     phoneNumberInput.value = phoneNumber.textContent;

//     fullName.classList.toggle('hidden');
//     birthDate.classList.toggle('hidden');
//     gender.classList.toggle('hidden');
//     address.classList.toggle('hidden');
//     phoneNumber.classList.toggle('hidden');
//     fullNameInput.classList.toggle('hidden');
//     birthDateInput.classList.toggle('hidden');
//     genderInput.classList.toggle('hidden');
//     addressInput.classList.toggle('hidden');
//     phoneNumberInput.classList.toggle('hidden');

//     fullNameInput.disabled = !fullNameInput.disabled;
//     birthDateInput.disabled = !birthDateInput.disabled;
//     genderInput.disabled = !genderInput.disabled;
//     addressInput.disabled = !addressInput.disabled;
//     phoneNumberInput.disabled = !phoneNumberInput.disabled;

//     profileBox.classList.toggle('editing');

//     editButton.style.display = 'none';
//     saveButton.style.display = 'inline-block';
// }

// // Function to save the profile data to the server and refresh the page
// function saveProfile() {
//     const saveButton = document.getElementById('save-button');
//     const editButton = document.getElementById('edit-button');
//     const fullName = document.getElementById('fullName');
//     const birthDate = document.getElementById('birthDate');
//     const gender = document.getElementById('gender');
//     const address = document.getElementById('address');
//     const phoneNumber = document.getElementById('phoneNumber');
//     const fullNameInput = document.getElementById('full-name-input');
//     const birthDateInput = document.getElementById('birth-date-input');
//     const genderInput = document.getElementById('gender-input');
//     const addressInput = document.getElementById('address-input');
//     const phoneNumberInput = document.getElementById('phone-number-input');

//     const data = {
//         fullName: fullNameInput.value,
//         birthDate: birthDateInput.value,
//         gender: genderInput.value,
//         address: addressInput.value,
//         phoneNumber: phoneNumberInput.value
//     };

//     const headers = new Headers({
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//     });

//     const options = {
//         method: 'PUT',
//         headers,
//         body: JSON.stringify(data)
//     };

//     fetch(url, options)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const contentType = response.headers.get('content-type');
//             if (contentType && contentType.includes('application/json')) {
//                 return response.json();
//             } else {
//                 throw new Error('Response was not in JSON format');
//             }
//         })
//         .then(data => {
//             console.log(data); // Log the response to inspect it

//             // Handle the JSON response
//             if (data) {
//                 fullName.textContent = data.fullName;
//                 birthDate.textContent = data.birthDate;
//                 gender.textContent = data.gender;
//                 address.textContent = data.address;
//                 phoneNumber.textContent = data.phoneNumber;
//                 fullNameInput.classList.toggle('hidden');
//                 birthDateInput.classList.toggle('hidden');
//                 genderInput.classList.toggle('hidden');
//                 addressInput.classList.toggle('hidden');
//                 phoneNumberInput.classList.toggle('hidden');
//                 fullName.classList.toggle('hidden');
//                 birthDate.classList.toggle('hidden');
//                 gender.classList.toggle('hidden');
//                 address.classList.toggle('hidden');
//                 phoneNumber.classList.toggle('hidden');
//                 editButton.style.display = 'inline-block';
//                 saveButton.style.display = 'none';
                
//                 // Reload the page
//                 location.reload();
//             } else {
//                 throw new Error('Invalid JSON response');
//             }
//         })
//         .catch(error => console.error(error));
// }

// // Function to fetch the user profile data from the server
// function fetchProfile() {
//     const id = document.getElementById('id');
//     const fullName = document.getElementById('fullName');
//     const birthDate = document.getElementById('birthDate');
//     const gender = document.getElementById('gender');
//     const address = document.getElementById('address');
//     const email = document.getElementById('email');
//     const phoneNumber = document.getElementById('phoneNumber');

//     const headers = new Headers({
//         'Authorization': `Bearer ${token}`
//     });

//     const options = {
//         method: 'GET',
//         headers
//     };

//     fetch(url, options)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Handle the JSON response
//             // ...

//             // Check if the JSON data is valid
//             if (data) {
//                 id.textContent = data.id;
//                 fullName.textContent = data.fullName;
//                 birthDate.textContent = data.birthDate;
//                 gender.textContent = data.gender;
//                 address.textContent = data.address;
//                 email.textContent = data.email;
//                 phoneNumber.textContent = data.phoneNumber;
//             } else {
//                 throw new Error('Invalid JSON response');
//             }
//         })
//         .catch(error => console.error(error));
// }

// // Add event listeners to the Edit and Save buttons
// const editButton = document.getElementById('edit-button');
// const saveButton = document.getElementById('save-button');
// editButton.addEventListener('click', toggleEditFields);
// saveButton.addEventListener('click', saveProfile);

// // Fetch the user profile data from the server
// fetchProfile();















// const url = "https://food-delivery.kreosoft.ru/api/account/profile";
// const token = JSON.parse(localStorage.getItem('token'));

// // Function to toggle between displaying text and input fields
// function toggleEditFields() {
//     const editButton = document.getElementById('edit-button');
//     const saveButton = document.getElementById('save-button');
//     const fullName = document.getElementById('fullName');
//     const birthDate = document.getElementById('birthDate');
//     const gender = document.getElementById('gender');
//     const address = document.getElementById('address');
//     const phoneNumber = document.getElementById('phoneNumber');
//     const fullNameInput = document.getElementById('full-name-input');
//     const birthDateInput = document.getElementById('birth-date-input');
//     const genderInput = document.getElementById('gender-input');
//     const addressInput = document.getElementById('address-input');
//     const phoneNumberInput = document.getElementById('phone-number-input');

//     fullNameInput.value = fullName.textContent;
//     birthDateInput.value = birthDate.textContent;
//     genderInput.value = gender.textContent;
//     addressInput.value = address.textContent;
//     phoneNumberInput.value = phoneNumber.textContent;

//     fullName.classList.toggle('hidden');
//     birthDate.classList.toggle('hidden');
//     gender.classList.toggle('hidden');
//     address.classList.toggle('hidden');
//     phoneNumber.classList.toggle('hidden');
//     fullNameInput.classList.toggle('hidden');
//     birthDateInput.classList.toggle('hidden');
//     genderInput.classList.toggle('hidden');
//     addressInput.classList.toggle('hidden');
//     phoneNumberInput.classList.toggle('hidden');

//     fullNameInput.disabled = !fullNameInput.disabled;
//     birthDateInput.disabled = !birthDateInput.disabled;
//     genderInput.disabled = !genderInput.disabled;
//     addressInput.disabled = !addressInput.disabled;
//     phoneNumberInput.disabled = !phoneNumberInput.disabled;

//     editButton.style.display = 'none';
//     saveButton.style.display = 'inline-block';
// }

// // Function to save the profile data to the server
// // Function to save the profile data to the server
// function saveProfile() {
//     const saveButton = document.getElementById('save-button');
//     const editButton = document.getElementById('edit-button');
//     const fullName = document.getElementById('fullName');
//     const birthDate = document.getElementById('birthDate');
//     const gender = document.getElementById('gender');
//     const address = document.getElementById('address');
//     const phoneNumber = document.getElementById('phoneNumber');
//     const fullNameInput = document.getElementById('full-name-input');
//     const birthDateInput = document.getElementById('birth-date-input');
//     const genderInput = document.getElementById('gender-input');
//     const addressInput = document.getElementById('address-input');
//     const phoneNumberInput = document.getElementById('phone-number-input');

//     const data = {
//         fullName: fullNameInput.value,
//         birthDate: birthDateInput.value,
//         gender: genderInput.value,
//         address: addressInput.value,
//         phoneNumber: phoneNumberInput.value
//     };

//     const headers = new Headers({
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//     });

//     const options = {
//         method: 'PUT',
//         headers,
//         body: JSON.stringify(data)
//     };

//     fetch(url, options)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data); // Log the response to inspect it

//             // Check if the response is valid JSON
//             if (response.headers.get('content-type')?.includes('application/json')) {
//                 // Handle the JSON response
//                 // ...

//                 // Check if the JSON data is valid
//                 if (data) {
//                     fullName.textContent = data.fullName;
//                     birthDate.textContent = data.birthDate;
//                     gender.textContent = data.gender;
//                     address.textContent = data.address;
//                     phoneNumber.textContent = data.phoneNumber;
//                     fullNameInput.classList.toggle('hidden');
//                     birthDateInput.classList.toggle('hidden');
//                     genderInput.classList.toggle('hidden');
//                     addressInput.classList.toggle('hidden');
//                     phoneNumberInput.classList.toggle('hidden');
//                     fullName.classList.toggle('hidden');
//                     birthDate.classList.toggle('hidden');
//                     gender.classList.toggle('hidden');
//                     address.classList.toggle('hidden');
//                     phoneNumber.classList.toggle('hidden');
//                     editButton.style.display = 'inline-block';
//                     saveButton.style.display = 'none';
//                 } else {
//                     throw new Error('Invalid JSON response');
//                 }
//             } else {
//                 throw new Error('Response was not in JSON format');
//             }
//         })
//         .catch(error => console.error(error));
// }



// // Function to fetch the user profile data from the server
// function fetchProfile() {
//     const id = document.getElementById('id');
//     const fullName = document.getElementById('fullName');
//     const birthDate = document.getElementById('birthDate');
//     const gender = document.getElementById('gender');
//     const address = document.getElementById('address');
//     const email = document.getElementById('email');
//     const phoneNumber = document.getElementById('phoneNumber');

//     const headers = new Headers({
//         'Authorization': `Bearer ${token}`
//     });

//     const options = {
//         method: 'GET',
//         headers
//     };

//     fetch(url, options)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Handle the JSON response
//             // ...

//             // Check if the JSON data is valid
//             if (data) {
//                 id.textContent = data.id;
//                 fullName.textContent = data.fullName;
//                 birthDate.textContent = data.birthDate;
//                 gender.textContent = data.gender;
//                 address.textContent = data.address;
//                 email.textContent = data.email;
//                 phoneNumber.textContent = data.phoneNumber;
//             } else {
//                 throw new Error('Invalid JSON response');
//             }
//         })
//         .catch(error => console.error(error));
// }

// // Add event listeners to the Edit and Save buttons
// const editButton = document.getElementById('edit-button');
// const saveButton = document.getElementById('save-button');
// editButton.addEventListener('click', toggleEditFields);
// saveButton.addEventListener('click', saveProfile);

// // Fetch the user profile data from the server
// fetchProfile();








// const url = "https://food-delivery.kreosoft.ru/api/account/profile";
// const token = JSON.parse(localStorage.getItem('token'));

// // Function to toggle between displaying text and input fields
// function toggleEditFields() {
//     const editButton = document.getElementById('edit-button');
//     const saveButton = document.getElementById('save-button');
//     const fullName = document.getElementById('fullName');
//     const birthDate = document.getElementById('birthDate');
//     const gender = document.getElementById('gender');
//     const address = document.getElementById('address');
//     const phoneNumber = document.getElementById('phoneNumber');
//     const fullNameInput = document.getElementById('full-name-input');
//     const birthDateInput = document.getElementById('birth-date-input');
//     const genderInput = document.getElementById('gender-input');
//     const addressInput = document.getElementById('address-input');
//     const phoneNumberInput = document.getElementById('phone-number-input');

//     fullNameInput.value = fullName.textContent;
//     birthDateInput.value = birthDate.textContent;
//     genderInput.value = gender.textContent;
//     addressInput.value = address.textContent;
//     phoneNumberInput.value = phoneNumber.textContent;

//     fullName.classList.toggle('hidden');
//     birthDate.classList.toggle('hidden');
//     gender.classList.toggle('hidden');
//     address.classList.toggle('hidden');
//     phoneNumber.classList.toggle('hidden');
//     fullNameInput.classList.toggle('hidden');
//     birthDateInput.classList.toggle('hidden');
//     genderInput.classList.toggle('hidden');
//     addressInput.classList.toggle('hidden');
//     phoneNumberInput.classList.toggle('hidden');

//     fullNameInput.disabled = !fullNameInput.disabled;
//     birthDateInput.disabled = !birthDateInput.disabled;
//     genderInput.disabled = !genderInput.disabled;
//     addressInput.disabled = !addressInput.disabled;
//     phoneNumberInput.disabled = !phoneNumberInput.disabled;

//     editButton.style.display = 'none';
//     saveButton.style.display = 'inline-block';
// }

// // Function to save the edited profile data
// function saveProfile() {
//     const saveButton = document.getElementById('save-button');
//     const editButton = document.getElementById('edit-button');
//     const fullName = document.getElementById('fullName');
//     const birthDate = document.getElementById('birthDate');
//     const gender = document.getElementById('gender');
//     const address = document.getElementById('address');
//     const phoneNumber = document.getElementById('phoneNumber');
//     const fullNameInput = document.getElementById('full-name-input');
//     const birthDateInput = document.getElementById('birth-date-input');
//     const genderInput = document.getElementById('gender-input');
//     const addressInput = document.getElementById('address-input');
//     const phoneNumberInput = document.getElementById('phone-number-input');

//     fullName.textContent = fullNameInput.value;
//     birthDate.textContent = birthDateInput.value;
//     gender.textContent = genderInput.value;
//     address.textContent = addressInput.value;
//     phoneNumber.textContent = phoneNumberInput.value;

//     fullName.classList.toggle('hidden');
//     birthDate.classList.toggle('hidden');
//     gender.classList.toggle('hidden');
//     address.classList.toggle('hidden');
//     phoneNumber.classList.toggle('hidden');
//     fullNameInput.classList.toggle('hidden');
//     birthDateInput.classList.toggle('hidden');
//     genderInput.classList.toggle('hidden');
//     addressInput.classList.toggle('hidden');
//     phoneNumberInput.classList.toggle('hidden');

//     fullNameInput.disabled = !fullNameInput.disabled;
//     birthDateInput.disabled = !birthDateInput.disabled;
//     genderInput.disabled = !genderInput.disabled;
//     addressInput.disabled = !addressInput.disabled;
//     phoneNumberInput.disabled = !phoneNumberInput.disabled;

//     saveButton.style.display = 'none';
//     editButton.style.display = 'inline-block';

//     // Call the API to update the profile data
//     const updatedProfileData = {
//         fullName: fullNameInput.value,
//         birthDate: birthDateInput.value,
//         gender: genderInput.value,
//         address: addressInput.value,
//         phoneNumber: phoneNumberInput.value
//     };

//     fetch(url, {
//         method: 'PUT',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         body: JSON.stringify(updatedProfileData)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Profile data updated:', data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

// // Fetch user profile data and display it
// fetch(url, {
//     method: 'GET',
//     headers: {
//         'Authorization': `Bearer ${token}`
//     }
// })
// .then(response => response.json())
// .then(data => {
//     const profileData = {
//         id: data.id,
//         fullName: data.fullName,
//         birthDate: data.birthDate,
//         gender: data.gender,
//         address: data.address,
//         email: data.email,
//         phoneNumber: data.phoneNumber
//     };

//     // Display user profile data
//     document.getElementById('id').textContent = profileData.id;
//     document.getElementById('fullName').textContent = profileData.fullName;
//     document.getElementById('birthDate').textContent = profileData.birthDate;
//     document.getElementById('gender').textContent = profileData.gender;
//     document.getElementById('address').textContent= profileData.address;
//     document.getElementById('email').textContent = profileData.email;
//     document.getElementById('phoneNumber').textContent = profileData.phoneNumber;

//     // Add event listener to the edit button
//     const editButton = document.getElementById('edit-button');
//     editButton.addEventListener('click', toggleEditFields);

//     // Add event listener to the save button
//     const saveButton = document.getElementById('save-button');
//     saveButton.addEventListener('click', saveProfile);
// })
// .catch(error => {
//     console.error('Error:', error);
// });










// const url = "https://food-delivery.kreosoft.ru/api/account/profile";
// const token = JSON.parse(localStorage.getItem('token'));

// // Function to toggle between displaying text and input fields
// function toggleEditFields() {
//     const editButton = document.getElementById('edit-button');
//     const saveButton = document.getElementById('save-button');
//     const fullName = document.getElementById('fullName');
//     const birthDate = document.getElementById('birthDate');
//     const gender = document.getElementById('gender');
//     const address = document.getElementById('address');
//     const phoneNumber = document.getElementById('phoneNumber');
//     const fullNameInput = document.getElementById('full-name-input');
//     const birthDateInput = document.getElementById('birth-date-input');
//     const genderInput = document.getElementById('gender-input');
//     const addressInput = document.getElementById('address-input');
//     const phoneNumberInput = document.getElementById('phone-number-input');

//     fullNameInput.value = fullName.textContent;
//     birthDateInput.value = birthDate.textContent;
//     genderInput.value = gender.textContent;
//     addressInput.value = address.textContent;
//     phoneNumberInput.value = phoneNumber.textContent;

//     fullName.classList.toggle('hidden');
//     birthDate.classList.toggle('hidden');
//     gender.classList.toggle('hidden');
//     address.classList.toggle('hidden');
//     phoneNumber.classList.toggle('hidden');
//     fullNameInput.classList.toggle('hidden');
//     birthDateInput.classList.toggle('hidden');
//     genderInput.classList.toggle('hidden');
//     addressInput.classList.toggle('hidden');
//     phoneNumberInput.classList.toggle('hidden');

//     editButton.style.display = 'none';
//     saveButton.style.display = 'inline-block';
// }

// // Function to save the edited profile data
// function saveProfile() {
//     const saveButton = document.getElementById('save-button');
//     const fullName = document.getElementById('fullName');
//     const birthDate = document.getElementById('birthDate');
//     const gender = document.getElementById('gender');
//     const address = document.getElementById('address');
//     const phoneNumber = document.getElementById('phoneNumber');
//     const fullNameInput = document.getElementById('full-name-input');
//     const birthDateInput = document.getElementById('birth-date-input');
//     const genderInput = document.getElementById('gender-input');
//     const addressInput = document.getElementById('address-input');
//     const phoneNumberInput = document.getElementById('phone-number-input');

//     fullName.textContent = fullNameInput.value;
//     birthDate.textContent = birthDateInput.value;
//     gender.textContent = genderInput.value;
//     address.textContent = addressInput.value;
//     phoneNumber.textContent = phoneNumberInput.value;

//     fullName.classList.toggle('hidden');
//     birthDate.classList.toggle('hidden');
//     gender.classList.toggle('hidden');
//     address.classList.toggle('hidden');
//     phoneNumber.classList.toggle('hidden');
//     fullNameInput.classList.toggle('hidden');
//     birthDateInput.classList.toggle('hidden');
//     genderInput.classList.toggle('hidden');
//     addressInput.classList.toggle('hidden');
//     phoneNumberInput.classList.toggle('hidden');

//     saveButton.style.display = 'none';
//     editButton.style.display = 'inline-block';

//     // Call the API to update the profile data
//     const updatedProfileData = {
//         fullName: fullNameInput.value,
//         birthDate: birthDateInput.value,
//         gender: genderInput.value,
//         address: addressInput.value,
//         phoneNumber: phoneNumberInput.value
//     };

//     fetch(url, {
//         method: 'PUT',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updatedProfileData)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Profile updated successfully:', data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

// // Add event listeners to the buttons
// document.addEventListener('DOMContentLoaded', () => {
//     const editButton = document.getElementById('edit-button');
//     const saveButton = document.getElementById('save-button');

//     editButton.addEventListener('click', toggleEditFields);
//     saveButton.addEventListener('click', saveProfile);
// });

// // Fetch user profile data and display it
// fetch(url, {
//     method: 'GET',
//     headers: {
//         'Authorization': `Bearer ${token}`
//     }
// })
// .then(response => response.json())
// .then(data => {
//     const profileData = {
//         id: data.id,
//         fullName: data.fullName,
//         birthDate: data.birthDate,
//         gender: data.gender,
//         address: data.address,
//         email: data.email,
//         phoneNumber: data.phoneNumber
//     };

//     // Display user profile data
//     document.getElementById('id').textContent = profileData.id;
//     document.getElementById('fullName').textContent = profileData.fullName;
//     document.getElementById('birthDate').textContent = profileData.birthDate;
//     document.getElementById('gender').textContent = profileData.gender;
//     document.getElementById('address').textContent = profileData.address;
//     document.getElementById('email').textContent = profileData.email;
//     document.getElementById('phoneNumber').textContent = profileData.phoneNumber;
// })
// .catch(error => {
//     console.error('Error:', error);
// });









// const url = "https://food-delivery.kreosoft.ru/api/account/profile";

// // retrieve authentication token from local storage
// const token = JSON.parse(localStorage.getItem('token'));

// fetch(url, {
//     method: 'GET',
//     headers: {
//         'Authorization': `Bearer ${token}`
//     }
// })
// .then(response => response.json())
// .then(data => {
//     console.log(data);
//     // display user profile data
//     const profileData = `
//         <p>ID: ${data.id}</p>
//         <p>Full Name: ${data.fullName}</p>
//         <p>Birth Date: ${data.birthDate}</p>
//         <p>Gender: ${data.gender}</p>
//         <p>Address: ${data.address}</p>
//         <p>Email: ${data.email}</p>
//         <p>Phone Number: ${data.phoneNumber}</p>
//     `;
//     const profileContainer = document.getElementById('profile-container');
//     profileContainer.innerHTML = profileData;
// })
// .catch(error => {
//     console.error('Error:', error);
// });





