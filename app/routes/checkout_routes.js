// // This is your test secret API key.
// const stripe = require('stripe')('sk_test_51LzixHFctdQVNwrZzTLKq1pxBXVc0Cf8DAm6ZEIo5H4plbKBQ0hbrHvwxsyvmbfDv1FXhEBspddY2Z5g3iTGc4TD00tfWqV3t4');
// const express = require('express');
// const router = express();
// router.use(express.static('public'));

// const YOUR_DOMAIN = 'http://localhost:3000';

// router.post('http://localhost:3000/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: 'price_1LzlR5FctdQVNwrZdqTG0KAY',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `${YOUR_DOMAIN}?success=true`,
//     cancel_url: `${YOUR_DOMAIN}?canceled=true`,
//     automatic_tax: {enabled: true},
//   });

//   res.redirect(303, session.url);
// });

// router.listen(3000, () => console.log('Running on port 3000'));

// module.exports = router

//can remove this whole file!