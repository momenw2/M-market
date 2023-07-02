    //     const url = "https://food-delivery.kreosoft.ru/api/account/login";

    // const form = document.querySelector('form');
    // form.addEventListener('submit', (e) => {
    // e.preventDefault(); // prevent form submission

    // const email = form.querySelector('input[name="email"]').value;
    // const password = form.querySelector('input[name="password"]').value;

    // const data = {
    //     email,
    //     password
    // };

    // fetch(url, {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers:{
    //     'Content-Type': 'application/json'
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    //     if (data.token) {
    //     // store the user token in local storage
    //     localStorage.setItem('token', JSON.stringify(data.token));
    //     // redirect to the home page
    //     window.location = "../html/home2.html";
    //     }
    //     else {
    //     // display an error message to the user
    //     const error = document.getElementById('error');
    //     error.style.color = "red";
    //     error.textContent = "Invalid email or password";
    //     }
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
    // });




        const url = "https://food-delivery.kreosoft.ru/api/account/login";

    const form = document.querySelector('form');
    const error = document.getElementById('error');

    form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent form submission

    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;

    const data = {
        email,
        password
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
        'Content-Type': 'application/json'
        }
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Invalid email or password');
        }
        return response.json();
        })
        .then(data => {
        if (data.token) {
            // Store the user token securely (e.g., encrypt, use secure storage mechanisms)
            localStorage.setItem('token', JSON.stringify(data.token));
            // Redirect to the home page or perform any necessary actions
            window.location = "../html/home2.html";
        } else {
            error.style.color = "red";
            error.textContent = "Invalid email or password";
        }
        })
        .catch(error => {
        error.style.color = "red";
        error.textContent = error.message;
        });
    });
