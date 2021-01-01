import { Router } from 'express'
import { Req, Res } from '../utils/generic-types'
import auth from '../middleware/auth'
import Profile from '../models/Profile'

const router = Router()

// TODO: add request validation and types, response types

/**
 * @description return full user profile
 */
router.get('/', auth, async (req: Req, res: Res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId })
    if (!profile) return res.status(404).send({ message: 'Profile not found' })

    return res.send(profile)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description update user profile
 * TODO: adjust this endpoint, for now it's just temporary
 */
router.put('/', auth, async (req: Req<{ tags: string[] }>, res: Res) => {
  const { tags } = req.body

  try {
    const profileToUpdate = await Profile.findOne({ user: req.userId })
    if (!profileToUpdate) return res.status(404).send({ message: 'Profile not found' })

    profileToUpdate.tags = tags
    await profileToUpdate.save()

    return res.send(profileToUpdate)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description return user's tags
 */
router.get('/tags', auth, async (req: Req, res: Res<string[]>) => {
  try {
    const profile = await Profile.findOne({ user: req.userId }).select('_id tags')
    if (!profile) return res.status(404).send({ message: 'Profile not found' })

    return res.send(profile.tags)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

export default router
