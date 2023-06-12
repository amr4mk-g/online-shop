"use strict";
const URL = "http://localhost:500/api/";
let total = 0, map, itemsList = [];

class Item {
    constructor(id, name, image, price, count) {
        this.id = id;  
        this.name = name;  
        this.image = image;  
        this.price = price;  
        this.count = count;
    }
    increment() { this.count += 1; } 
    decrement() { this.count -= 1; }
    getTotalPrice() { return this.price*this.count; }
    getProductsCount() { return this.count; }
}

(async function() { 
    map = new Map(JSON.parse(localStorage.getItem("cartItems")));
    document.querySelector(".cart-count").innerHTML = map.size;
    let set = new Set(JSON.parse(localStorage.getItem("favItems")));
    document.querySelector(".fav-count").innerHTML = set.size;

    for (let [id, count] of map) {
        await fetch(URL+"products/"+id)
        .then(res => res.json())
        .then(res => { itemsList.push(new Item(res.data._id, res.data.name, res.data.image, res.data.price, count)) })
        .catch(err => { console.log(err); });
    } 
    viewProducts();
})();

function viewProducts() { 
    total = 0;
    let products = ""; 
    for (let item of itemsList) {
        products += product(item);
        total += item.getTotalPrice();
    }
    document.getElementById("products").innerHTML = products;
    document.getElementById("sub-total").innerHTML = `$${total}`;
}

const product = (item) =>
` <tr> <td class="align-middle"> <img src="${item.image}" style="width: 50px"/>${item.name}</td>
    <td class="align-middle">$${item.price}</td>
    <td class="align-middle">
    <div class="input-group quantity mx-auto" style="width: 100px">
    <div class="input-group-btn" data-id="${item.id}" onclick="decrementItem(this)">
      <button type="button" class="decBtn btn btn-sm btn-primary btn-minus"><i class="fa fa-minus"></i></button>
    </div>
    <input readonly type="text" class="quantityVal form-control form-control-sm bg-secondary border-0 text-center" 
        value="${item.getProductsCount()}" data-id="${item.id}"/>
    <div class="input-group-btn" data-id="${item.id}" onclick="incrementItem(this)">
      <button type="button" class="incBtn btn btn-sm btn-primary btn-plus"><i class="fa fa-plus"></i></button>
    </div> </div> </td>
    <td class="align-middle">$${item.getTotalPrice()}</td>
    <td class="align-middle">
    <button class="btn btn-sm btn-danger" type="button" data-id="${item.id}" onclick="removeItem(this)"><i class="fa fa-times"></i></button>
 </td> </tr> `;

function incrementItem(item) { 
    let id = item.dataset.id;
    let count = map.get(id);
    if (!count || count == 100) return;
    map.set(id, count+1);
    itemsList[getIndex(id)].increment();
    update();
} 

function decrementItem(item) {
    let id = item.dataset.id;
    let count = map.get(id);
    if (!count || count == 1) return;
    map.set(id, count-1);
    itemsList[getIndex(id)].decrement();
    update();
}

function removeItem(item) {
    let id = item.dataset.id;
    map.delete(id); 
    itemsList.splice(getIndex(id), 1);
    document.querySelector(".cart-count").innerHTML = map.size;
    update();
}

function getIndex(id) {
    for (let i=0; i<itemsList.length; i++) if (itemsList[i].id == id) return i;
}

function update() {
    localStorage.setItem("cartItems", JSON.stringify(Array.from(map.entries())));
    viewProducts();
}