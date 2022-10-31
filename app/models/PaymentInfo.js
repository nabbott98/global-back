const mongoose = require('mongoose')

const paymentInfoSchema = new mongoose.Schema(
    {
        name: {
            //bcrypt
            type: Number,
            required: true
        },
        card_number: {
            type: String,
            required: true
        },
        expiration: {
            //bcrypt
            type: String,
            required: true
        },
        sec_code: {
            type: Number,
            required: true
        },
        billing_address: {
            type: Object,
            required: true
        }
    }, {
        timestamps: true
    })

module.exports = paymentInfoSchema
