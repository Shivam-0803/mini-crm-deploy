import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  displayName: String,
  firstName: String,
  lastName: String,
  profilePicture: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Static method to find or create user from Google profile
userSchema.statics.findOrCreate = async function(profile) {
  try {
    let user = await this.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await this.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profilePicture: profile.photos[0].value
      });
    } else {
      // Update user information
      user.displayName = profile.displayName;
      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
      user.profilePicture = profile.photos[0].value;
      user.lastLogin = new Date();
      await user.save();
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

export default User; 