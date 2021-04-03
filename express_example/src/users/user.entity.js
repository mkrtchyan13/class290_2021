const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {usr_roles} = require('../commons/util');

const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        minlength: 4,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    firstName: {
        type: String,
        trim: true,
        required: true,
    },

    lastName: {
        type: String,
        trim: true,
        required: true,
    },

    role: {
        type: String,
        enum: [usr_roles.admin, usr_roles.customer],
        default: usr_roles.customer
    },
    fail_counter:{
        type: Number,
        default: 0
   },
   state:{
       type: Boolean,
       default: false
   }
}, { collection: 'users' });

schema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync();
        this.password = bcrypt.hashSync(this.password, salt);
    }

    next();
})

module.exports = mongoose.model('User', schema);