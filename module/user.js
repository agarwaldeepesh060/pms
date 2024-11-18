const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/pms');
var conn = mongoose.Collection;
var userSchema = new Schema({
    username:{
        type:String,
        required: true,
        index: {
            unique: true,
        }
    },
    email: {
        type:String,
        required: true,
        index: {
            unique: true,
        }
    },
    password: {
        type:String,
        required:true,
        
    },
    date: {
        type:Date,
        default:Date.now
    },
    
    
});

var userModel = mongoose.model('users', userSchema);
module.exports= userModel;