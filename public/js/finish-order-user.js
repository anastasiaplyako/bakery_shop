document.querySelector('#lite-shop-order1').onsubmit = function(event){
    event.preventDefault();
    console.log('in BUTTON');
}


fetch('/finish-order-user', {
    method: 'POST',
    body: JSON.stringify({
        'key': JSON.parse(localStorage.getItem('cart')),
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
        } else {
            alert('NOT success');
        }
    })
