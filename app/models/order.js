const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
	{
		owner: {
			type: String,
			required: true,
		},
		items: [],
        total: Number,
        payment_info: {
            firstName: String,
            lastName: String,
            cardNumber: Number,
            required: true,
        },
        shipping_address: {
            postalCode: Number,
            address: String,
            required: true,
        },
        order_date: String,
	},
	{
		timestamps: true,
        // Add virtual to calculate price
        // toObject: {virtuals: true}
	}
)

module.exports = mongoose.model('Order', orderSchema)