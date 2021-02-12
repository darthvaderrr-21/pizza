import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('.cart-counter')
let alertMsg = document.querySelector('#success-alert')

function updateCart(pizza){
    axios.post('/update-cart', pizza).then( res=>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: 'Itme added in cart'
            // layout: 'topright/ bottomleft/ bottomright'
        }).show();
    }).catch(err=>{
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: 'Something went wrong!'
            // layout: 'topright/ bottomleft/ bottomright'
        }).show();
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        // console.log(e)
        updateCart(pizza)
    })
})

if(alertMsg) {
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}

initAdmin()