const { Router } = require('express')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const userManager = req.app.get('userManager')
        const users = await userManager.getAll(req.query)

        res.status(200).json(users)
    }
    catch (err) {
        return res.status(400).json({ success: false })
    }
})

// TODO_2: controlar accesos de admin mediante middleware!

const userIsAdmin = async (req,res,next)=>{
    const email = req.headers["x-user-email"] //Pasar en [], porque js no reconoce " - " . 
    const userManager = req.app.get('userManager')
    const user = await userManager.getByEmail(email)
    if (!user || user.role !== "admin" ) { //condicion del role
        res.status(401).json({error:"user should be admin" })
        return
    }
    next()
}

router.delete('/:id',userIsAdmin, async (req, res) => { // incorporamos el middlware
    try {
        const userManager = req.app.get('userManager')
        await userManager.deleteById(req.params.id)

        res.status(200).json({ success: true })
    }
    catch (err) {
        return res.status(500).json({ success: false })
    }
})

router.post('/',userIsAdmin, async (req, res) => {// incorporamos el middlware
    try {
        const userManager = req.app.get('userManager')
        console.log(req.body)
        await userManager.addUser(req.body)

        return res.status(200).json({ success: true })
    }
    catch (err) {
        return res.status(400).json({ success: false })
    }
})

module.exports = router