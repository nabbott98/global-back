const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
	{
        note: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
	},
	{
		timestamps: true,
	}
)

module.exports = reviewSchema
