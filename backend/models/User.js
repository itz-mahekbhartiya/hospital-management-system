const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false // Will not be returned in queries by default
    },
    role: {
        type: String,
        enum: ['PATIENT', 'DOCTOR', 'ADMIN'],
        default: 'PATIENT'
    },
    
    // --- Role-Specific Fields ---

    // Patient Fields
    medicalHistory: {
        type: String,
        default: ''
    },

    // Doctor Fields
    specialty: {
        type: String,
        enum: ["OPD", "Skin care", "ENT", "Dermatologist", "OTHER"],
        default: "OPD"
    },


    // Staff Fields (Doctor, Admin)
    isActive: { // For Admin to control staff
        type: Boolean,
        default: true
    }

}, { timestamps: true }); // Adds createdAt and updatedAt




// --- Mongoose Middleware ---

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);