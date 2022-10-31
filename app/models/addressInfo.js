const mongoose = require('mongoose')

const addressInfoSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		phoneNumber: {
				type: Number,
				required: true,
			},
		streetAddress: {
				type: String,
				required: true,
			},
			aptAddress: String,
		city: {
				type: String,
				required: true,
			},
		state: {
				type: String,
				required: true,
			},
		zip: {
				type: Number,
				required: true,
			},
		default: Boolean,
		deliveryInstructions: String,
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		}
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('AddressInfo', addressInfoSchema)
