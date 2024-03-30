const fs = require('fs')

// TODO_3: user manager con persistencia de Fs
class UserManager {
    #path
    #users

    constructor(filepath) {
        this.#path = filepath
        this.#users = []
    }

    async prepare() {
        try {
            const fileContents = await fs.promises.readFile(this.#path, 'utf-8')
            const users = JSON.parse(fileContents)
            this.#users = users
        } catch (err) {
            this.#users = []
        }
    }

    async #updateFile() {
        await fs.promises.writeFile(
            this.#path,
            JSON.stringify(this.#users, null, 4)
        )
    }

    async getAll(filters = null) {
        // TODO_1: implementar filtros
        const genre = filters && filters.genre
        const filteredByGerne = genre
            ? this.#users.filter(u => u.genre === genre)
            : this.#users

        const name = filters && filters.name
        const filteredByName = name
            ? filteredByGerne.filter(u => u.name.startsWith(name))
            : filteredByGerne

        return filteredByName
    }

    async deleteById(id) {
        // TODO_1: implementar!
        const userIndex = this.#users.findIndex(u => u.id === id)
        if (userIndex < 0) {
            return
        }
        this.#users.splice(userIndex, 1)
        await this.#updateFile()
    }

    async addUser(user) {
        // TODO_1: implementar!
        const {name, lastName, email, age, genre} = user
        const emailAlreadyStored = this.#users.findIndex(u => u.email === email) >= 0
        const invalidAge = isNaN(+age) || +age <= 0
        const invalidGenre = !["H", "M"].includes(genre)

        if(!name || !lastName || !email || emailAlreadyStored || invalidAge || invalidGenre){
             throw new error ("Invalid user data")
        }
       
        this.#users.push({
            name,
            lastName,
            email,
            age: +age,
            genre,
            role:"user",
            id: parseInt(Math.random()* 10000).toString()
        })
        // volcar los datos al archivo
        await this.#updateFile()


    }

    async getByEmail(email) {
        // TODO_2: implementar!
            return this.#users.find(u => u.email === email)
    }
}

module.exports = UserManager