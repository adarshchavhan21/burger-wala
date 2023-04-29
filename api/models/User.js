const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: String, 
    photo: String,
    googleId: {
        required: true,
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {timestamps: true});

module.exports = model('User', userSchema);