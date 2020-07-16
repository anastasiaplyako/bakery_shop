let cart = {};
document.querySelectorAll('.add-to-card').forEach(function(element){
    element.onclick = addToCart;
    console.log('to cart');
});

console.log('just');

if(localStorage.getItem('cart')){
    console.log('getitem');
    cart = JSON.parse(localStorage.getItem('cart'));
    ajaxGetGoodsInfo();
}

function addToCart(){
    console.log('this.dataset.goods_id;', this.dataset.goods_id);
    let goodsId = this.dataset.goods_id;
    if(cart[goodsId]){
        cart[goodsId]++;
    } else {
        cart[goodsId] = 1;
    }
    console.log(cart);
    ajaxGetGoodsInfo();
}

function ajaxGetGoodsInfo(){
    updateLocalStorageCart();
    fetch('/get-goods-info', {
        method: 'POST',
        body: JSON.stringify({key: Object.keys(cart)}),
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        return response.text();
    }).then(function(body){
        console.log(body);
        showCart(JSON.parse(body));
    })
}

function showCart(data){
    console.log('data', data);
    console.log('cart', cart);
    let out = '<table class = "table table-striped table-cart"><tbody> ';
    let total = 0;
    for (let key in cart) {
        out += `<tr><td colspan = 4><a href = "/ind-product?id=${key}">${data[key]['name']}</a></td></tr>`;
        out += `<tr><td><i class = "fas fa-minus cart-minus" data-goods_id = "${key}" </td>`;
        out += `<td>${cart[key]}</td>`;
        out += `<td><i class = "fas fa-plus cart-plus" data-goods_id = "${key}"</td>`;
        out += `<td>${formatPrice(data[key]['price'] * cart[key])}</td>`;
        out += '</tr>';
        total += cart[key] * data[key]['price']
    }
    out += `<tr><td colspan="3">Total</td><td>${formatPrice(total)}</td></tr>`;
    out += total;
    out += '</tbody></table>';
    document.querySelector('#cart-nav').innerHTML = out;
    document.querySelectorAll('.cart-minus').forEach(function(element){
        element.onclick = cartMinus;
    });
    document.querySelectorAll('.cart-plus').forEach(function(element){
        element.onclick = cartPlus;
    })
}

function cartPlus(){
    let goodsId = this.dataset.goods_id;
    cart[goodsId]++;
    ajaxGetGoodsInfo();
}

function cartMinus(){
    let goodsId = this.dataset.goods_id;
    if (cart[goodsId] - 1 > 0){
        cart[goodsId]--;
    } else {
        delete(cart[goodsId]);
    }
    ajaxGetGoodsInfo();
}

function updateLocalStorageCart(){
    localStorage.setItem('cart', JSON.stringify(cart))
}

function formatPrice(price){
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&  ');
}
