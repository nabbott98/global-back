const mongoose = require('mongoose')

const addressInfoSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		phoneNumber: {
				type: String,
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
				type: String,
				required: true,
			},
		primary: Boolean,
		deliveryInstructions: String
	},
	{
		timestamps: true,
	}
)

module.exports = addressInfoSchema
