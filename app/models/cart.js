const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
	{
		item_id: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Cart', cartSchema)