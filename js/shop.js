"use strict";
const URL = "http://localhost:500/api/";
let originalList = [], currentList = [], limitItems = 9, currPage = 1;

(async function() { 
    let map = new Map(JSON.parse(localStorage.getItem("cartItems")));
    document.querySelector(".cart-count").innerHTML = map.size;
    let set = new Set(JSON.parse(localStorage.getItem("favItems")));
    document.querySelector(".fav-count").innerHTML = set.size;

    fetch(URL+"categories")
        .then(res => res.json())
        .then(res => { viewCategories(res.data); })
        .catch(err => { console.log(err); });

    fetch(URL+"products")
        .then(res => res.json())
        .then(res => { 
            originalList = res.data;   
            currentList = res.data; 
            viewProducts(); 
        }).catch(err => { console.log(err); });
})();

function viewCategories(items) { 
    let str = "";
    for (let item of items) str += `<a class="nav-item nav-link">${item.name}</a>`;
    document.querySelector(".dropdown-menu").innerHTML = str;
}

function viewProducts() { 
    if (!currentList.length) return;
    let [start, end] = mangePages();
    let str = "";
    for (let i=start; i<end; i++) str += product(currentList[i]);
    document.querySelector(".all-products").innerHTML = 
        document.querySelector("#filters").outerHTML + str + document.querySelector("#pagination").outerHTML;
}

function saveFilters() {
    let checkboxes = document.querySelectorAll('form input[type="checkbox"]');
    let filters = Array.from(checkboxes).filter(it => it.checked).map(it => it.id);
    currentList = originalList.filter(item => { return( 
        (filters.includes('price-all')) ||
        (filters.includes('price-1') && item.price >= 0 && item.price <= 100) ||
        (filters.includes('price-2') && item.price >= 100 && item.price <= 200) ||
        (filters.includes('price-3') && item.price >= 200 && item.price <= 300) ||
        (filters.includes('price-4') && item.price >= 300 && item.price <= 400) ||
        (filters.includes('price-5') && item.price >= 400 && item.price <= 500) );
    }).filter(item => { return( 
        (filters.includes('color-all')) ||
        (filters.includes('color-1') && item.color == 'black') ||
        (filters.includes('color-2') && item.color == 'white') ||
        (filters.includes('color-3') && item.color == 'red') ||
        (filters.includes('color-4') && item.color == 'blue') ||
        (filters.includes('color-5') && item.color == 'green') );
    }).filter(item => { return( 
        (filters.includes('size-all')) ||
        (filters.includes('size-1') && item.size == 'xs') ||
        (filters.includes('size-2') && item.size == 's') ||
        (filters.includes('size-3') && item.size == 'm') ||
        (filters.includes('size-4') && item.size == 'l') ||
        (filters.includes('size-5') && item.size == 'xl') );
    });
    viewProducts();
}

const product = (item) =>`<div class="col-lg-4 col-md-6 col-sm-6 pb-1">
<div class="product-item bg-light mb-4">
    <div class="product-img position-relative overflow-hidden">
        <img class="img-fluid w-100" src="${item.image}" alt="">
        <div class="product-action">
            <a class="btn btn-outline-dark btn-square" data-id="${item._id}" onclick="addToCart(this)"><i class="fa fa-shopping-cart"></i></a>
            <a class="btn btn-outline-dark btn-square" data-id="${item._id}" onclick="addToFav(this)"><i class="far fa-heart"></i></a>
            <a class="btn btn-outline-dark btn-square"><i class="fa fa-sync-alt"></i></a>
            <a class="btn btn-outline-dark btn-square"><i class="fa fa-search"></i></a>
        </div>
    </div>
    <div class="text-center py-4">
        <a class="h6 text-decoration-none text-truncate" href="">${item.name}</a>
        <div class="d-flex align-items-center justify-content-center mt-2">
            <h5>$${item.price.toFixed(2)*(1-item.discount)}</h5>
            <h6 class="text-muted ml-2"><del>$${item.price.toFixed(2)}</del></h6>
        </div>
        <div class="d-flex align-items-center justify-content-center mb-1">
            ${drawRate(item.rating)}
            <small>(${item.rating_count})</small>
        </div>
    </div> </div> </div>`;

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

function sorting(type) { 
    document.querySelector('.dropdown-toggle1').click();
    if (type == 1) {
        currentList.sort((a,b)=>(a.price - b.price));
        type = "Price";
    } else if (type == 2){
        currentList.sort((a,b)=>(a.rating_count - b.rating_count));
        type = "Popularity";
    } else {
        currentList.sort((a,b)=>(a.rating - b.rating));
        type = "Best Rating";
    }
    document.querySelector('.dropdown-toggle1').innerHTML = `Sorting (${type})`;
    viewProducts();
}

function showing(num) {
    document.querySelector('.dropdown-toggle2').click();
    document.querySelector('.dropdown-toggle2').innerHTML = `Showing (${num})`;
    limitItems = num;
    currPage = 1;
    viewProducts(); 
}

function mangePages() {
    let totalPages = Math.ceil(currentList.length / limitItems);
    let numInPage = Math.min(limitItems, currentList.length);
    let prev = `<li class="page-item ${(currPage == 1)?'disabled':''}" ${(currPage == 1)?'':'style="cursor: pointer;"'}>
                    <a class="page-link" data-id="0" onclick="toPage(this)">Previous</a></li>`;
    let next = `<li class="page-item ${(currPage == totalPages)?'disabled':''}" ${(currPage == totalPages)?'':'style="cursor: pointer;"'}>
                    <a class="page-link" data-id="-1" onclick="toPage(this)">Next</a></li>`;
    let content = "";
    for (let i = 1; i <= totalPages; i++) {
        content += `<li class="page-item ${(i == currPage)?'active disabled':''}" ${(i == currPage)?'':'style="cursor: pointer;"'}>
                        <a class="page-link" data-id="${i}" onclick="toPage(this)">${i}</a></li>`;
    }
    document.querySelector(".pages-row").innerHTML = prev + content + next;   
    let start = (currPage-1)*numInPage, end = Math.min(start+numInPage, currentList.length); 
    return [start, end];
}

function toPage(item) {
    let i = parseInt(item.dataset.id); 
    if (i == 0) currPage -= 1;
    else if (i == -1) currPage += 1;
    else currPage = i;
    viewProducts();
}