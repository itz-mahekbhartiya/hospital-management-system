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
        select: false 
    },
    role: {
        type: String,
        enum: ['PATIENT', 'DOCTOR', 'ADMIN'],
        default: 'PATIENT'
    },
    
    // Role-Specific Fields

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


    
    isActive: { 
        type: Boolean,
        default: true
    }

}, { timestamps: true }); 




// Mongoose Middleware


UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);