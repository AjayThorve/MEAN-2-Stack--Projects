let mongoose = require('mongoose');

//User Schema
let userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: false
    },
    password:{
        type: String,
        required: false
    }
});

let User = module.exports = mongoose.model('User', userSchema);