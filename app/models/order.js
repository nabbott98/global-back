const mongoose = require('mongoose')
const addressInfoSchema = require('./addressInfo')
const paymentInfoSchema = require('./paymentInfo')

const orderSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		items: [],
        total: Number,
		addressInfo: addressInfoSchema
	},
	{
		timestamps: true,
        // Add virtual to calculate price
        // toObject: {virtuals: true}
	}
)

module.exports = mongoose.model('Order', orderSchema)