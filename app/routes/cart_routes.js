// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for carts
const Cart = require('../models/cart')
const User = require('../models/user')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { cart: { title: '', text: 'foo' } } -> { cart: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
const { serializeUser } = require('passport')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /carts
router.get('/carts', requireToken, (req, res, next) => {
	User.findOne({ _id: req.user.id })
		.then(handle404)
		.then((user) => res.status(200).json({ cart: user.cart.toObject() }))
		// if `findById` is succesful, respond with 200 and "item" JSON
		.catch(next)
})

// CREATE
// POST /carts
router.post('/carts/:userId/:itemId', requireToken, (req, res, next) => {
	// find user by id
	const { userId, itemId } = req.params
	req.body.itemId = itemId

	User.findOne({ _id: userId })
		.then(handle404)
		.then((user) => {
			// push req.body into cart and it creates since it is a subdocument
			user.cart.push(req.body)
			// return updated user
			return user.save()
		})
		// send 201 status to server and return the user as the response
		.then(user => res.status(201).json({ user: user }))
		.catch(next)
})


// UPDATE a cart item
// PATCH -> /carts/userId/cartId
router.patch('/carts/:userId/:cartId', requireToken, (req, res, next) => {
    const { userId, cartId } = req.params
    // find the user
    User.findById(userId)
        .then(handle404)
        .then(user => {
            // get the specific cart Item
            const theCartItem = user.cart.id(cartId)
            // update that cart item with the req body
            theCartItem.set(req.body)

            return user.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DESTROY
// DELETE /carts/userId/cartId
router.delete('/carts/:userId/:cartId', requireToken, (req, res, next) => {
    const { userId, cartId } = req.params
    // find the user
    User.findById(userId)
        .then(handle404)
        .then(user => {
            // get the specific cart Item
            const theCartItem = user.cart.id(cartId)
            theCartItem.remove()

            return user.save()
        })
        .then((user) => res.sendStatus(204))
        .catch(next)
})

module.exports = router
