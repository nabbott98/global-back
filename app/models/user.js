const mongoose = require('mongoose')

const cartSchema = require('./cart')
const addressInfoSchema = require('./addressInfo')


const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
		token: String,
		cart: [cartSchema],
		addressInfo: [addressInfoSchema],
	},
	{
		timestamps: true,
		toObject: {
			// remove `hashedPassword` field when we call `.toObject`
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)
