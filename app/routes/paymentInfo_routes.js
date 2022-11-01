// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for paymentInfos
const PaymentInfo = require('../models/paymentInfo')
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
// { paymentInfo: { title: '', text: 'foo' } } -> { paymentInfo: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
const { serializeUser } = require('passport')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /paymentInfos
router.get('/paymentInfos', requireToken, (req, res, next) => {
	User.findOne({ _id: req.user.id })
		.then(handle404)
		.then((user) => res.status(200).json({ paymentInfo: user.paymentInfo.toObject() }))
		// if `findById` is succesful, respond with 200 and "item" JSON
		.catch(next)
})

// SHOW
//^ Dont think we need a show route for the paymentInfo
// GET /paymentInfos/5a7db6c74d55bc51bdf39793
router.get('/paymentInfos/:id', requireToken, (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	PaymentInfo.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "paymentInfo" JSON
		.then((paymentInfo) => res.status(200).json({ paymentInfo: paymentInfo.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /paymentInfos
router.post('/paymentInfos', requireToken, (req, res, next) => {
	// find user by id
	User.findOne({ _id: req.user.id })
		.then(handle404)
		.then((user) => {
			// push req.body into paymentInfo and it creates since it is a subdocument
			user.paymentInfo.push(req.body)
			// return updated user
			return user.save()
		})
		// send 201 status to server and return the user as the response
		.then(user => res.status(201).json({ user: user }))
		.catch(next)
})


// UPDATE a paymentInfo item
// PATCH -> /paymentInfos/userId/paymentInfoId
router.patch('/paymentInfos/:userId/:paymentInfoId', requireToken, (req, res, next) => {
    const { userId, paymentInfoId } = req.params
    // find the user
    User.findById(userId)
        .then(handle404)
        .then(user => {
            // get the specific paymentInfo Item
            const thePaymentInfoItem = user.paymentInfo.id(paymentInfoId)
            // update that paymentInfo item with the req body
            thePaymentInfoItem.set(req.body)

            return user.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DESTROY
// DELETE /paymentInfos/5a7db6c74d55bc51bdf39793
router.delete('/paymentInfos/:userId/:paymentInfoId', requireToken, (req, res, next) => {
    const { userId, paymentInfoId } = req.params
    // find the user
    User.findById(userId)
        .then(handle404)
        .then(user => {
            // get the specific paymentInfo Item
            const thePaymentInfoItem = user.paymentInfo.id(paymentInfoId)
            thePaymentInfoItem.remove()

            return user.save()
        })
        .then((user) => res.sendStatus(204))
        .catch(next)
})

module.exports = router
