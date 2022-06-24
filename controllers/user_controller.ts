import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User'

// NEW USER *************
export const registerNewUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body

  // validations
  if (!username) return res.status(422).json({ message: 'Username is required!' })
  if (!email) return res.status(422).json({ message: 'Email is required!' })
  if (!password) return res.status(422).json({ message: 'Password is required!' })

  // check user exists
  const userExists = await User.findOne({ email: email, username: username })
  if (userExists) return res.status(422).json({ message: 'Existing User!' })

  // create password
  let newPassword = password.toString()
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(newPassword, salt)

  // create user
  const user = new User({
    username,
    email,
    role,
    password: passwordHash
  })

  try {
    await user.save()

    res.status(201).json({ message: 'User created successfully!', user })
  }
  catch (error) {
    console.log(error)
    res.status(500).json({ message: 'There was an error on the server, please try again later' })
  }
}

// All USERS *************
export const usersProfiles = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    console.log(users)

    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'There was an error on the server, please try again later' })
  }
}

// DELETE USER *************
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const registers = await User.findByIdAndDelete(req.params.id)
    if (!registers) return res.status(404).json({ message: "User not found" })

    res.status(200).json({ message: 'User successfully deleted!' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'There was an error on the server, please try again later' })
  }
}

// LOGIN USER *************
export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body

  // validations
  if (!email) return res.status(422).json({ message: 'Email is required!' })
  if (!password) return res.status(422).json({ message: 'Password is required!' })

  // check user exists
  const user = await User.findOne({ email: email })
  if (!user) return res.status(404).json({ message: 'User not found' })

  // check password match
  const checkPassword = await bcrypt.compare(password, user.password)
  if (!checkPassword) return res.status(422).json({ message: 'Invalid password!' })

  try {
    const secret: string | any = process.env.SECRET
    const token = jwt.sign({
      id: user._id,
      role: user.role,
    },
      secret,
      { expiresIn: 86400 }
    )

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 dia
    })

    res.status(200).json({ message: 'Authentication successful!', token, user })
  }
  catch (error) {
    console.log(error)
    res.status(500).json({ message: 'There was an error on the server, please try again later' })
  }
}

// GET USER *************
export const useProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const user = await User.findById(id, '-password')
    if (!user) return res.status(404).json({ message: 'User not found!' })

    res.status(200).json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'There was an error on the server, please try again later' })
  }
}

// UPDATE USER *************
export const useUpdate = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const user = await User.findById(id, '-password')
    if (!user) return res.status(404).json({ message: 'User not found!' })

    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.status(200).json(updateUser)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'There was an error on the server, please try again later' })
  }
}


