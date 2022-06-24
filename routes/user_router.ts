import express from 'express'
import {
  deleteProfile,
  useProfile,
  usersProfiles,
  useUpdate
} from '../controllers/user_controller'
import { checkToken } from '../middlewares/auth'
const router = express.Router()

router.get('/profiles', checkToken, usersProfiles)

router.get('/user/:id', checkToken, useProfile)

router.put('/update/:id', checkToken, useUpdate)

router.delete('/deluser/:id', checkToken, deleteProfile)

export default router
