const Order = require('../../../models/order')
const moment = require('moment')

function orderController() {
    return {
        store(req, res) {
            // Validating request:
            const {phone, address} = req.body
            if(!phone || !address){
                req.flash('error', 'All fields are required!')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address: address
            })

            order.save().then( result=>{
                req.flash('success', 'Order placed successfully')
                delete req.session.cart
                return res.redirect('/customer/orders')
            }).catch(err=>{
                req.flash('error', 'Something went wrong!')
                return res.redirect('/cart')
            })
        },

        async index(req, res) {
            // Here we fetch data form DB, for that we many methods (1) using Callbacks 
            // (2) using promises then(),catch() (3) using async-await.
            const orders = await Order.find({customerId: req.user._id}, null, {sort: {'createdAt': -1}})
            // Cache control not to appear the success popup again&again:
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', {orders: orders, moment: moment})
            console.log(orders)
        
        }
    }
}

module.exports = orderController