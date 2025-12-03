// Quick test script to verify Razorpay configuration
require('dotenv').config();
const Razorpay = require('razorpay');

console.log('\n🧪 Testing Razorpay Configuration...\n');

// Check environment variables
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing');
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✅ Set' : '❌ Missing');
console.log('');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('❌ Razorpay credentials are missing in .env file!');
    process.exit(1);
}

try {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log('✅ Razorpay instance created successfully');
    console.log('');

    // Try to create a test order
    console.log('Creating a test order...');

    razorpay.orders.create({
        amount: 50000, // amount in paise (500 INR)
        currency: 'INR',
        receipt: 'test_receipt_' + Date.now(),
        notes: {
            test: 'true'
        }
    })
        .then(order => {
            console.log('✅ Test order created successfully!');
            console.log('Order ID:', order.id);
            console.log('Amount:', order.amount / 100, 'INR');
            console.log('\n🎉 Razorpay is configured correctly!\n');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Error creating test order:');
            console.error('Error message:', error.message);
            console.error('Error description:', error.description);
            console.error('Status code:', error.statusCode);
            console.error('\nFull error:', error);
            console.log('\n⚠️  Please check your Razorpay credentials and account status.');
            process.exit(1);
        });

} catch (error) {
    console.error('❌ Error initializing Razorpay:', error.message);
    process.exit(1);
}
