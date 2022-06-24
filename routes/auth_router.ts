import express from 'express'
import { registerNewUser, userLogin } from '../controllers/user_controller'
import { checkToken } from '../middlewares/auth'
const router = express.Router()

router.post('/register', registerNewUser)

router.post('/login', userLogin)

export default router
