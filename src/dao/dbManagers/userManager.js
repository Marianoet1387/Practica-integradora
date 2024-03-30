const UserModel = require('../models/user.model')

class UserManager {
    constructor() {}

    async prepare() {
        if (UserModel.db.readyState !== 1) {
            throw new error("must connect  to mongoose")   
        }
    }

    async getAll(filters = null) {
          const { genre, name } = { genre: null, name: null, ...filters }

        const conditions = []
        
        if(genre){
            conditions.push({genre})
        }

        if (name) {
            conditions.push({
                name:{
                    $regex:`^${name}`, // Devuelve coincidencias en la primer letra que buscamos
                    $options:"i" //  Que NO estrictamente respete las mayusculas y minusculas
                }
            })
        }

        const users = conditions.length // Si hay alguna condicion :
            ? await UserModel.find({$and: conditions})
            : await UserModel.find()

        return users.map(u => u.toObject({virtuals: true}) ) // Pasar los "modelos" a objetos conocidos por Js
    }

    async deleteById(id) {
        return UserModel.deleteOne({_id: id})
    }

    async addUser(user) {
       
        const {name, lastName, email, age, genre} = user  
        const invalidAge = isNaN(+age) || +age <= 0

        if(!name || !lastName || !email || invalidAge ){
             throw new error ("Invalid user data")
        }
        await UserModel.create({
            name,
            lastName,
            email,
            age: +age,
            genre,
            role:"user",
        })
    }

    async getByEmail(email) {
        return await UserModel.findOne({email})
    }
}

module.exports = UserManager