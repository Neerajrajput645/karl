const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  phone: String,
  userType: String,
  firstName: String,
  lastName: String,
  email: String
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function makeDistributor() {
  try {
    await mongoose.connect(process.env.MONGO_URI.trim());
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ phone: '6268800426' });
    if (!user) {
      console.log('User not found with phone 6268800426');
      process.exit(1);
    }
    
    console.log('Found user:', user.firstName, user.lastName);
    
    user.userType = 'Distributor';
    await user.save();
    
    console.log('Successfully made user a Distributor!');
    console.log('Updated user:', { 
      phone: user.phone, 
      name: user.firstName + ' ' + user.lastName,
      userType: user.userType 
    });
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeDistributor();
