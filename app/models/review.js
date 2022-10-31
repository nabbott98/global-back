const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
	{
        note: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Review', reviewSchema)
