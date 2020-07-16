document.querySelector('#lite-shop-order').onsubmit = function(event){
    event.preventDefault();
    let username = document.querySelector('#username').value.trim();
    let phone = document.querySelector('#phone').value.trim();
    let email = document.querySelector('#email').value.trim();
    let surname = document.querySelector('#surname').value.trim();
    let name = document.querySelector('#name').value.trim()
    let address = document.querySelector('#address').value.trim()


    fetch('/finish-order1', {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'phone': phone,
            'address': address,
            'email': email,
            'key': JSON.parse(localStorage.getItem('cart')),
            'surname': surname,
            'name': name
        }),
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function(response){
        return response.text();
    })
        .then(function(body) {
            if (body === '1'){
                swal({
                    title: 'Success',
                    text: 'Заказ оформлен. Чек отправлен на электронную почту',
                    type: 'info',
                    confirmButtonText: 'Ok'
                });
            } else {
                swal({
                    title: 'Warning',
                    text: 'Что- то пошло не так',
                    type: 'info',
                    confirmButtonText: 'Ok'
                });
            }
        })

};