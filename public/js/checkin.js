document.querySelector('#registr').onsubmit = function(event){
    event.preventDefault();
    let username= document.querySelector('#username').value.trim()
    let name = document.querySelector('#name').value.trim()
    let surname = document.querySelector('#surname').value.trim()
    let address = document.querySelector('#address').value.trim()
    let email = document.querySelector('#email').value.trim();
    let password = document.querySelector('#psw').value.trim()
    let passwordCheck = document.querySelector('#pswCheck').value.trim()
    let phone = document.querySelector('#phone').value.trim();


    let regexp = /^[A-Za-zА-Яа-я|\s\-]+$/;
    let regexpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!regexp.test(name)){
        swal({
            title: 'Warning',
            text: 'Введите верное имя',
            type: 'info',
            confirmButtonText: 'Ok'
        });
        return false;
    }

    if(!regexp.test(surname)){
        swal({
            title: 'Warning',
            text: 'Введите верную фамилию',
            type: 'info',
            confirmButtonText: 'Ok'
        });
        return false;
    }

    if(!regexpEmail.test(email)){
        swal({
            title: 'Warning',
            text: 'Введите верный email',
            type: 'info',
            confirmButtonText: 'Ok'
        });
        return false;
    }

    console.log(password.length);
    
    if (password.length < 4){
        swal({
            title: 'Warning',
            text: 'Пароль не может состоят меньше, чем из 4 символов',
            type: 'info',
            confirmButtonText: 'Ok'
        });
        return false;
    }

    if(password !== passwordCheck){
        swal({
            title: 'Warning',
            text: 'Ваши пароли не совпадают',
            type: 'info',
            confirmButtonText: 'Ok'
        });
        return false;
    }

    fetch('/finish-checkin', {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'name' : name,
            'surname' : surname,
            'password' : password,
            'phone': phone,
            'address': address,
            'email': email,
        }),
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function(response){
        return response.text();
    })
        .then(function(body) {
            if(body === '1'){
                swal({
                    title: 'Success',
                    text: 'Регистрация успешно пройдена. Теперь войдите ',
                    type: 'info',
                    confirmButtonText: 'Ok'
                });
            }
        })
};