var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: { type: String },
    phoneNumber: { type: Array },
    emailId: { type: Array },
    urls:{type:String},
    fax: { type: Array },
    address: 
        {
            type: String
        }
    ,
    socialLink:{type:Array}
  
})

module.exports = new mongoose.model('greenbook', schema)