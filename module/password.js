const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const passwordSchema = new Schema({
   password:{
    type:String,
    required:true,
   },
    category:{
        type: String,
        ref: 'Category.name',
        required: true,
   }
})
const password = mongoose.model('password',passwordSchema );
module.exports = password
