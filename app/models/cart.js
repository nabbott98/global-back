const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
	{
		itemId: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		}
	},
	{
		timestamps: true,
	}
)

module.exports = cartSchema