// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for addressInfos
const AddressInfo = require('../models/addressInfo')
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
// { addressInfo: { title: '', text: 'foo' } } -> { addressInfo: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
const { serializeUser } = require('passport')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /addressInfos
router.get('/addressInfos', requireToken, (req, res, next) => {
	User.findOne({ _id: req.user.id })
		.then(handle404)
		.then((user) => res.status(200).json({ addressInfo: user.addressInfo.toObject() }))
		// if `findById` is succesful, respond with 200 and "item" JSON
		.catch(next)
})

// SHOW
// GET /addressInfos/
router.get('/addressInfos/:id', requireToken, (req, res, next) => {
    const { id } = req.params
    // find the user
    User.findOne({ _id: req.user.id })
        .then(handle404)
        .then(user => {
            // get the specific addressInfo Item
            addressInfoItem = user.addressInfo.id(id)
            // update that addressInfo item with the req body
            return addressInfoItem
        })
        .then((addressInfoItem) => res.status(200).json({ addressInfoItem: addressInfoItem.toObject() }))
        .catch(next)
})

// CREATE
// POST /addressInfos
router.post('/addressInfos', requireToken, (req, res, next) => {
	// find user by id
	User.findOne({ _id: req.user.id })
		.then(handle404)
		.then((user) => {
			// push req.body into addressInfo and it creates since it is a subdocument
			user.addressInfo.push(req.body)
			// return updated user
			return user.save()
		})
		// send 201 status to server and return the user as the response
		.then(user => res.status(201).json({ user: user }))
		.catch(next)
})


// UPDATE a addressInfo item
// PATCH -> /addressInfos/userId/addressInfoId
router.patch('/addressInfos/:userId/:addressInfoId', requireToken, (req, res, next) => {
    const { userId, addressInfoId } = req.params
    // find the user
    User.findById(userId)
        .then(handle404)
        .then(user => {
            // get the specific addressInfo Item
            const theAddressInfoItem = user.addressInfo.id(addressInfoId)
            // update that addressInfo item with the req body
            theAddressInfoItem.set(req.body)

            return user.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DESTROY
// DELETE /addressInfos/5a7db6c74d55bc51bdf39793
router.delete('/addressInfos/:userId/:addressInfoId', requireToken, (req, res, next) => {
    const { userId, addressInfoId } = req.params
    // find the user
    User.findById(userId)
        .then(handle404)
        .then(user => {
            // get the specific addressInfo Item
            const theAddressInfoItem = user.addressInfo.id(addressInfoId)
            theAddressInfoItem.remove()

            return user.save()
        })
        .then((user) => res.sendStatus(204))
        .catch(next)
})

module.exports = router
