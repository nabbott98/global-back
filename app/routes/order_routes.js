// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for orders
const Order = require('../models/order')
const Item = require('../models/item')
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { order: { title: '', text: 'foo' } } -> { order: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /orders
// router.get('/orders', requireToken, (req, res, next) => {
// 	Order.find()
// 		.then((orders) => {
// 			// `orders` will be an array of Mongoose documents
// 			// we want to convert each one to a POJO, so we use `.map` to
// 			// apply `.toObject` to each one
// 			return orders.map((order) => order.toObject())
// 		})
// 		// respond with status 200 and JSON of the orders
// 		.then((orders) => res.status(200).json({ orders: orders }))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })

// SHOW
// GET /orders/5a7db6c74d55bc51bdf39793
router.get('/orders/:id', requireToken, (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Order.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "order" JSON
		.then((order) => res.status(200).json({ order: order.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /orders
router.post('/orders/:paymentId/:addressId', requireToken, (req, res, next) => {
	const { paymentId, addressId } = req.params
	req.body.items = []
	req.body.total = 0
	User.findOne({ _id: req.user.id })
        .then(handle404)
        .then(user => {
            // get the specific addressInfo Item
            req.body.addressInfo = user.addressInfo.id(addressId)
			req.body.paymentInfo = user.addressInfo.id(paymentId)
            // update that addressInfo item with the req body
			cart = user.cart
			cart.forEach(element => {
				Item.findOne(element.itemId)
					// .then(handle404)
					.then(cartItem => {
						req.body.items.push(cartItem)
						req.body.total += cartItem.price
						return req
					})
					.catch(next)
			})
            return req
        })
		.then (req => {
			Order.create(req.body)
		})

})

// index that shows only the user's orders
router.get('/orders/mine', requireToken, (req, res) => {
    // find the apods, by ownership
    Order.find({ owner: req.session.userId })
    	// then display the order
		.then((orders) => {
			// `orders` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return orders.map((order) => order.toObject())
		})
		.then((orders) => res.status(200).json({ orders: orders }))
    	// or throw an error if there is one
        .catch(error => res.json(error))
})