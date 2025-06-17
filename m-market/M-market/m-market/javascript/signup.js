    // const form = document.querySelector('#signup-form');
    // form.addEventListener('submit', function(event) {
    // event.preventDefault();
    // const formData = new FormData(event.target);
    // const data = {
    //     fullName: formData.get('Username'),
    //     password: formData.get('password'),
    //     email: formData.get('email'),
    //     address: formData.get('Address'),
    //     birthDate: formData.get('birthday') + 'T00:00:00.000Z',
    //     gender: formData.get('format'),
    //     phoneNumber: formData.get('phonenumber'),
    // };
    // fetch('https://food-delivery.kreosoft.ru/api/account/register', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // })
    // .then(response => {
    //     if (response.ok) {
    //     // Success! Return a message to the user
    //     alert('Sign up successful! You will now be redirected to the login page.');
    //     // Redirect the user to the login page
    //     window.location.href = '../html/login.html';
    //     } else {
    //     // Error! Display the error message to the user
    //     response.text().then(errorMessage => {
    //         alert('Error: ' + errorMessage);
    //     });
    //     }
    // })
    // .catch(error => console.error(error));
    // });




        const form = document.querySelector('#signup-form');
        form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            fullName: formData.get('Username'),
            password: formData.get('password'),
            email: formData.get('email'),
            address: formData.get('Address'),
            birthDate: formData.get('birthday') + 'T00:00:00.000Z',
            gender: formData.get('format'),
            phoneNumber: formData.get('phonenumber'),
        };
        
        const phoneNumberRegex = /^\+7\d{10}$/; // Regex for +7 followed by 10 digits
        
        if (!phoneNumberRegex.test(data.phoneNumber)) {
            alert('Please enter a valid phone number with the format +7xxxxxxxxxx');
            return;
        }
        
        fetch('https://food-delivery.kreosoft.ru/api/account/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
            if (response.ok) {
                // Success! Return a message to the user
                alert('Sign up successful! You will now be redirected to the login page.');
                // Redirect the user to the login page
                window.location.href = '../html/login.html';
            } else {
                // Error! Display the error message to the user
                response.text().then(errorMessage => {
                alert('Error: ' + errorMessage);
                });
            }
            })
            .catch(error => console.error(error));
        });
            