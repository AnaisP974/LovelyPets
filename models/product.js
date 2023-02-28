var mongoose = require('mongoose');

//  Pour pouvoir manipuler et exploiter les collections de votre base de données, il faudra, pour chaque collection créer un schéma et un modèle associé à chaque collection
var ProductSchema = mongoose.Schema({
    mea: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
});
    
module.exports = mongoose.model('products', ProductSchema);
    