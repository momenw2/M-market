    const url = "https://food-delivery.kreosoft.ru/api/account/login";

    const form = document.querySelector("form");
    const error = document.getElementById("error");
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');


    class LoginData {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    }


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
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
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
