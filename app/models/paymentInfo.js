const mongoose = require('mongoose')

const paymentInfoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        // bcrypt
        card_number: {
            type: Number,
            required: true
        },
        expiration: {
            type: String,
            required: true
        },
        // bcrypt
        sec_code: {
            type: Number,
            required: true
        },
    // Add billing adddress in later
    }, {
        timestamps: true
    })

module.exports = paymentInfoSchema
