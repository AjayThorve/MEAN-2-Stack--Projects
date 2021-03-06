let mongoose = require('mongoose');

//Article Schema
let articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: false
    },
    image_url:{
        type: String,
        required: false
    }
});

let Article = module.exports = mongoose.model('article', articleSchema);