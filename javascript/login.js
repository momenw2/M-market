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

    const form = document.querySelector("form");
    const error = document.getElementById("error");

    form.addEventListener("submit", (e) => {
    e.preventDefault();
    const credentials = getCredentials();

    if (!validateCredentials(credentials)) {
        showError("Please fill in all fields");
        return;
    }

    loginUser(credentials);
    });

    function getCredentials() {
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();
    return new LoginData(email, password);
    }

    function validateCredentials({ email, password }) {
    return email.length > 0 && password.length > 0;
    }

    function loginUser(credentials) {
    fetch(url, {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
        "Content-Type": "application/json",
        },
    })
        .then((response) => {
        if (!response.ok) {
            throw new Error(getLoginErrorText());
        }
        return response.json();
        })
        .then((responseData) => {
        if (responseData.token) {
            localStorage.setItem("token", JSON.stringify(responseData.token));
            window.location = "../html/home2.html";
        } else {
            showError(getLoginErrorText());
        }
        })
        .catch((error) => {
        showError(error.message);
        });
    }
