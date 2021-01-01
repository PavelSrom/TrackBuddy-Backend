import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { RegisterASP, LoginASP } from 'trackbuddy-shared/payloads/auth'
import { TokenASR } from 'trackbuddy-shared/responses/auth'
import { registerValidation, loginValidation } from '../validations/auth'
import { getKey } from '../utils/get-key'
import { Req, Res } from '../utils/generic-types'
import auth from '../middleware/auth'
import User from '../models/User'
import Journal from '../models/Journal'
import Profile from '../models/Profile'
import Habit from '../models/Habit'
import Notification from '../models/Notification'

const router = Router()

/**
 * @description refresh token
 */
router.get('/', auth, async (req: Req, res: Res<TokenASR>) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) return res.status(404).send({ message: 'Unable to reauthorize' })

    const token = jwt.sign({ id: user._id }, getKey('JWT_SECRET'), {
      expiresIn: 86400,
    })

    return res.send({ token })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description register a new user
 */
router.post('/register', async (req: Req<RegisterASP>, res: Res<TokenASR>) => {
  const { error } = registerValidation.validate(req.body)
  if (error) return res.status(400).send({ message: 'Invalid request' })

  const { firstName, lastName, email, password } = req.body

  try {
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).send({ message: 'This email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      email,
      password: hashedPassword,
    })
    await newUser.save()

    const newProfile = new Profile({
      user: newUser._id,
      firstName,
      lastName,
      avatar: '',
    })
    await newProfile.save()

    const token = jwt.sign({ id: newUser._id }, getKey('JWT_SECRET'), {
      expiresIn: 86400,
    })

    return res.status(201).send({ token })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description login for an existing user
 */
router.post('/login', async (req: Req<LoginASP>, res: Res<TokenASR>) => {
  const { error } = loginValidation.validate(req.body)
  if (error) return res.status(400).send({ message: 'Invalid request' })

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).send({ message: 'Invalid credentials' })

    // @ts-ignore
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).send({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id }, getKey('JWT_SECRET'), {
      expiresIn: 86400,
    })

    return res.send({ token })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description delete user profile
 */
router.delete('/', auth, async (req: Req, res: Res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).send({ message: 'Cannot find your profile' })

    await user.remove()
    await Profile.deleteMany({ user: req.userId })
    await Journal.deleteMany({ user: req.userId })
    await Habit.deleteMany({ user: req.userId })
    await Notification.deleteMany({ user: req.userId })
    // remove notifications, journals, habits, bucket list...

    return res.send({ message: 'Account has been deleted' })
  } catch (err) {
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description request a new password
 */
router.post('/pw-request', async (req: Req, res: Res) => {
  try {
    //
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description confirm password change
 */
router.post('/pw-confirm', async (req: Req, res: Res) => {
  try {
    //
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

export default router
