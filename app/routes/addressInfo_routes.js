const express = require('express')
const passport = require('passport')
const AddressInfo = require('../models/addressInfo')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
// GET
router.get('/addressInfo', requireToken, (req, res, next) => {
	AddressInfo.find()
		.then((addresses) => {
			return addresses.map((address) => address.toObject())
		})
		.then((addresses) => res.status(200).json({ addresses: addresses }))
		.catch(next)
})

// CREATE
// POST
router.post('/addressInfo', requireToken, (req, res, next) => {
	req.body.addressInfo.owner = req.user.id
	AddressInfo.create(req.body.addressInfo)
		.then((address) => {
			res.status(201).json({ address: address.toObject() })
		})
		.catch(next)
})

// SHOW
// GET 
router.get('/addressInfo/:id', requireToken, (req, res, next) => {
	AddressInfo.findById(req.params.id)
		.then(handle404)
		.then((address) => res.status(200).json({ address: address.toObject() }))
		.catch(next)
})

// UPDATE
// PATCH
router.patch('/addressInfo/:id', requireToken, removeBlanks, (req, res, next) => {
	delete req.body.addressInfo.owner
	AddressInfo.findById(req.params.id)
		.then(handle404)
		.then((address) => {
			requireOwnership(req, address)
			return address.updateOne(req.body.address)
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

// DESTROY
// DELETE 
router.delete('/addressInfo/:id', requireToken, (req, res, next) => {
	AddressInfo.findById(req.params.id)
		.then(handle404)
		.then((address) => {
			requireOwnership(req, address)
			address.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router
