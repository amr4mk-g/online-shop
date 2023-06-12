"use strict";
const URL = "http://localhost:500/api/";

(async function() { 
    let map = new Map(JSON.parse(localStorage.getItem("cartItems")));
    document.querySelector(".cart-count").innerHTML = map.size;
    let set = new Set(JSON.parse(localStorage.getItem("favItems")));
    document.querySelector(".fav-count").innerHTML = set.size;

    fetch(URL+"categories")
        .then(res => res.json())
        .then(res => { viewCategories(res.data); })
        .catch(err => { console.log(err); });

    fetch(URL+"products/getFeatured")
        .then(res => res.json())
        .then(res => { viewFeatured(res.data); })
        .catch(err => { console.log(err); });

    fetch(URL+"products/getRecent")
        .then(res => res.json())
        .then(res => { viewRecent(res.data); })
        .catch(err => { console.log(err); });
})();

function viewCategories(items) { 
    let str = "";
    for (let item of items) str += category(item);
    document.querySelector(".dropdown-menu").innerHTML = str;

    items.sort((a,b)=>(b.productCount - a.productCount));
    str = "";
    for (let i=0; i<4; i++) str += section(items[i]);
    document.querySelector(".top-categories").innerHTML = str;

    document.querySelectorAll('.to-shop').forEach(
        it => it.addEventListener('click', event=>{window.location.href = 'shop.html';})
    );
}

function viewFeatured(items) {
    let str = "";
    for (let i=0; i<8; i++) str += product(items[i]);
    document.querySelector(".featured-pro").innerHTML = str;
}

function viewRecent(items) { 
    let str = "";
    for (let i=0; i<8; i++) str += product(items[i]);
    document.querySelector(".recent-pro").innerHTML = str;
}

const category = (item) =>`<a class="nav-item nav-link">${item.name}</a>`;
  
const section = (item) =>`
    <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
    <a class="text-decoration-none">
    <div class="cat-item d-flex align-items-center mb-4">
        <div class="overflow-hidden" style="width: 100px; height: 100px">
        <img class="img-fluid" src="${item.image}" alt="" />
    </div>
    <div class="flex-fill pl-3 to-shop" style="cursor: pointer;">
        <h6>${item.name}</h6>
        <small class="text-body">${item.productCount} Products</small>
    </div>
    </div> </a> </div>`;

const product = (item) =>`
    <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
    <div class="product-item bg-light mb-4">
    <div class="product-img position-relative overflow-hidden">
        <img class="img-fluid w-100" src="${item.image}" alt="" />
    <div class="product-action">
        <a class="btn btn-outline-dark btn-square" data-id="${item._id}" onclick="addToCart(this)"><i class="fa fa-shopping-cart"></i></a>
        <a class="btn btn-outline-dark btn-square" data-id="${item._id}" onclick="addToFav(this)"><i class="far fa-heart"></i></a>
        <a class="btn btn-outline-dark btn-square"><i class="fa fa-sync-alt"></i></a>
        <a class="btn btn-outline-dark btn-square"><i class="fa fa-search"></i></a>
    </div> </div>
    <div class="text-center py-4">
        <a class="h6 text-decoration-none text-truncate" href="">${item.name}</a>
        <div class="d-flex align-items-center justify-content-center mt-2">
        <h5>$${item.price.toFixed(2)*(1-item.discount)}</h5>
        <h6 class="text-muted ml-2"><del>$${item.price.toFixed(2)}</del></h6>
    </div>
    <div class="d-flex align-items-center justify-content-center mb-1">
        ${drawRate(item.rating)}
        <small>(${item.rating_count})</small>
    </div> </div> </div> </div>`;

function drawRate(rating) {
    let str = "";
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) str += '<small class="fa fa-star text-primary mr-1"></small>';
        else if (rating >= i-0.5) str += '<small class="fas fa-star-half-alt text-primary mr-1"></small>';
        else str += '<small class="far fa-star text-primary mr-1"></small>';
    }
    return str;
}

function addToCart(item) {
    let map = new Map(JSON.parse(localStorage.getItem("cartItems")));
    map.set(item.dataset.id, map.get(item.dataset.id)+1 || 1);
    localStorage.setItem("cartItems", JSON.stringify(Array.from(map.entries())));
    document.querySelector(".cart-count").innerHTML = map.size;
}

function addToFav(item) {
    let set = new Set(JSON.parse(localStorage.getItem("favItems")));
    set.add(item.dataset.id);
    localStorage.setItem("favItems", JSON.stringify(Array.from(set)));
    document.querySelector(".fav-count").innerHTML = set.size;
}




