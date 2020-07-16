document.querySelector('.close-nav').onclick = closeNav;
document.querySelector('.show-nav').onclick = showNav;

function showNav(){
    document.querySelector('.site-nav').style.left = '0';
}

function closeNav(){
    document.querySelector('.site-nav').style.left = '-300';
}
