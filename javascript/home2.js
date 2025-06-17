function logout() {
    fetch('https://food-delivery.kreosoft.ru/api/account/logout', {
        method: 'POST'
    })
    .then(response => {
        window.location.href = '../index.html';
    })
    .catch(error => {
        console.error('Logout failed:', error);
    });
}