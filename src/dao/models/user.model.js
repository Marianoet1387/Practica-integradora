const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        unique: true
    },
    name:{
        type:String,
        required: true
    },
    lastName: {
        type: String,
        required:true
    },
    age:{
        type: Number,
        required:true
    },
    genre:{
        type:String,
        required: true,
        enum:["H", "M"] // hace que el campo "genre" siempre sea H o M (docu en mongoose)
    },
    role:{
        type:String,
        required: true,
        default: "user" // Por defuolt, sin ponerle ningun valor, se pone el dato user.
    }
})
schema.virtual("id").get(function () {
    return this._id.toString()
})

module.exports = mongoose.model("User",schema,"users") // 1° nombre del modelo, 2° un esquema y 3° el nombre de la colleccion