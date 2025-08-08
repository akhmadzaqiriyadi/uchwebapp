// test-email.js
require('dotenv').config();
const { testEmailConnection, sendBookingNotification } = require('./src/services/email.service');

async function runEmailTest() {
  console.log('🧪 Testing Email Configuration...');
  console.log('================================');
  
  // Test 1: Check environment variables
  console.log('\n📋 Checking environment variables:');
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT}`);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'Set ✅' : 'Not set ❌'}`);
  
  // Test 2: Test connection
  console.log('\n🔌 Testing SMTP connection...');
  const connectionTest = await testEmailConnection();
  
  if (connectionTest) {
    console.log('\n✅ Email configuration is correct!');
    
    // Test 3: Send test email (optional)
    console.log('\n📧 Would you like to send a test email? (Uncomment the lines below)');
    /*
    try {
      await sendBookingNotification(
        process.env.EMAIL_USER, // Send to yourself
        'Test Email - UCH Backend',
        'This is a test email from UCH Backend system. If you receive this, your email configuration is working properly!'
      );
      console.log('✅ Test email sent successfully!');
    } catch (error) {
      console.log('❌ Failed to send test email:', error.message);
    }
    */
  } else {
    console.log('\n❌ Email configuration has issues. Please check your settings.');
  }
}

runEmailTest().catch(console.error);
