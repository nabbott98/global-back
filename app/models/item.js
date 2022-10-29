const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
        category: {
			type: String,
			required: true,
		},
        price: {
			type: Number,
			required: true,
		},
        description: {
			type: String,
			required: true,
		},
        image: {
			type: String,
			required: true,
		},
        stock: {
			type: Number,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Item', itemSchema)