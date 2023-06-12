"use strict";
const URL = "http://localhost:500/api/";
let total = 0, tax = 10, map, userID = "", userToken = "", orders = [];

(async function() { 
    map = new Map(JSON.parse(localStorage.getItem("cartItems")));
    document.querySelector(".cart-count").innerHTML = map.size;
    let set = new Set(JSON.parse(localStorage.getItem("favItems")));
    document.querySelector(".fav-count").innerHTML = set.size;
    userToken = localStorage.getItem("token");
    userID = localStorage.getItem("userID");

    let products = "";
    for (let [id, count] of map) {
        await fetch(URL+"products/"+id)
        .then(res => res.json())
        .then(res => { 
            let item = res.data;
            products += `<div class="d-flex justify-content-between"> 
                <p>${item.name} x (${count})</p> <p>$${item.price * count}</p> </div>`;
            total += item.price * count;
            orders.push({"product_id": id, "price": item.price, "qty": count});
        });
    } 

    document.querySelector(".invoice").innerHTML = 
        `<div class="border-bottom">
            <h6 class="mb-3">Products</h6> ${products} 
        </div>  
        <div class="border-bottom pt-3 pb-2">
        <div class="d-flex justify-content-between mb-3">
             <h6>Subtotal</h6> <h6>$${total}</h6>
        </div>
        <div class="d-flex justify-content-between">
            <h6 class="font-weight-medium">Tax</h6>
            <h6 class="font-weight-medium tax-amount">$${tax}</h6>
        </div>  </div>
        <div class="pt-2">
        <div class="d-flex justify-content-between mt-2">
            <h5>Total</h5> <h5 class="total-amount">$${total + tax}</h5>
        </div>  </div>`; 
})();

let payment = document.querySelectorAll('input[name="payment"]');
payment.forEach(it => {
    it.addEventListener('change', event =>{
        tax = parseInt(event.target.value);
        document.querySelector(".tax-amount").innerHTML = `$${tax}`;
        document.querySelector(".total-amount").innerHTML = `$${total + tax}`;
    });
});

const send = document.getElementById('send-order');
send.addEventListener('click', event =>{
    event.preventDefault(); 
    if (userToken == '' || userToken == null) {
        window.location.href = 'login.html';
        return;
    }

    let fname = document.getElementById('fname').value.trim();
    let lname = document.getElementById('lname').value.trim();
    let email = document.getElementById('email').value.trim();
    let mobile = document.getElementById('mobile').value.trim();
    if (fname.length == 0) {
        alert("You must enter your first name!");
        return;
    } else if (lname.length == 0) {
        alert("You must enter your last name!");
        return;
    } else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
        alert("This email is invalid!");
        return;
    } else if (!(/^[0\+]\d{10}$/).test(mobile)) {
        alert("This phone number is invalid!");
        return;
    }

    send.disabled = true;
    let data = {
        "shipping_info": {"first_name": fname, "last_name": lname, "email": email, "mobile_number": mobile,
            "address1": "", "address2": "", "country": "", "city": "", "state": "", "zip_code": ""},
        "sub_total_price": total, "shipping": tax, "total_price": total+tax,
        "user_id": userID, "order_date": new Date(), "order_details": orders
    }; 
    let options = {
        method: 'POST', body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json','x-access-token': `${userToken}`}
    };
    fetch(URL+"orders", options)
        .then(res => res.json())
        .then(res => { 
            send.disabled = false;
            alert("Congratulation, Order placed successfully");
        }).catch(err => { console.log(err); });
});
