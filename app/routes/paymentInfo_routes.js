const express = require('express')
const passport = require('passport')
const AddressInfo = require('../models/addressInfo')
const PaymentInfo = require('../models/paymentInfo')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
// GET
router.get('/paymentInfo', requireToken, (req, res, next) => {
    console.log("thisran")
	PaymentInfo.find()
		.then((payments) => {
            console.log(payments)
			return payments.map((payments) => payments.toObject())
		})
		.then((payments) => res.status(200).json({ payments: payments }))
		.catch(next)
})

// CREATE
// POST
router.post('/paymentInfo', (req, res, next) => {
	// req.body.paymentInfo.owner = req.user.id
	PaymentInfo.create(req.body.paymentInfo)
		.then((payment) => {
            console.log(payment)
			res.status(201).json({payments: payment.toObject() })
		})
		.catch(next)
})

// SHOW
// GET 
router.get('/paymentInfo/:id', requireToken, (req, res, next) => {
	PaymentInfo.findById(req.params.id)
		.then(handle404)
		.then((payment) => res.status(200).json({ payment: payment.toObject() }))
		.catch(next)
})

// UPDATE
// PATCH
router.patch('/paymentInfo/:id', requireToken, removeBlanks, (req, res, next) => {
	// delete req.body.paymentInfo.owner
	PaymentInfo.findById(req.params.id)
		.then(handle404)
		.then((payment) => {
			requireOwnership(req, payment)
			return payment.updateOne(req.body.payment)
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

// DESTROY
// DELETE 
router.delete('/paymentInfo/:id', requireToken, (req, res, next) => {
	PaymentInfo.findById(req.params.id)
		.then(handle404)
		.then((payment) => {
			requireOwnership(req, payment)
			payment.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router
