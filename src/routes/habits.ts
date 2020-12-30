import { Router } from 'express'
import { Types } from 'mongoose'
// import { startOfDay, endOfDay } from 'date-fns'
import auth from '../middleware/auth'
import Habit from '../models/Habit'
import { Req, Res } from '../utils/generic-types'

const router = Router()

/**
 * SPOILER:
 * repetitions should NEVER be returned all!
 * there's a possibility that users might have thousands of repetitions,
 * which drastically increases the size of the response
 *
 * - always return repetitions for a specific time period
 */

/**
 * @description get habits with last rep and without reps array
 */
router.get('/', auth, async (req: Req, res: Res) => {
  try {
    const allHabits = await Habit.aggregate([
      { $match: { user: Types.ObjectId(req.userId) } },
      // deserialize any arrays before manipulation
      { $unwind: '$repetitions' },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          color: { $first: '$color' },
          duration: { $first: '$duration' },
          frequency: { $first: '$frequency' },
          newestRep: { $max: '$repetitions' },
        },
      },
    ])

    return res.send(allHabits)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description create a new habit, TODO
 */
router.post('/', auth, async (req: Req, res: Res) => {
  try {
    const newHabit = new Habit({
      user: req.userId,
      ...req.body,
    })
    await newHabit.save()

    return res.status(201).send(newHabit)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description delete a habit
 */
router.delete('/:id', auth, async (req: Req, res: Res) => {
  try {
    const habitToDelete = await Habit.findById(req.params.id)
    if (!habitToDelete) return res.status(404).send({ message: 'Habit not found' })
    if (habitToDelete.user !== req.userId)
      return res.status(403).send({ message: 'Access denied' })

    await habitToDelete.remove()

    return res.send(habitToDelete)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description check a habit for a specific day
 */
router.post('/:id/check', auth, async (req: Req, res: Res) => {
  try {
    //
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description uncheck a habit for a specific day
 */
router.delete('/:id/check', auth, async (req: Req, res: Res) => {
  try {
    //
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description return repetitions for a specific time period
 */
router.get('/:id/repetitions', auth, async (req: Req, res: Res<number[]>) => {
  const { min, max } = req.query

  if (!min || !max || +min > +max)
    return res.status(400).send({ message: 'Invalid time period' })

  try {
    const habitRepetitions = await Habit.aggregate([
      { $match: { _id: Types.ObjectId(req.params.id) } },
      {
        $project: {
          repetitions: {
            $filter: {
              input: '$repetitions',
              as: 'repetitions',
              cond: {
                $and: [
                  { $gte: ['$$repetitions', +min] },
                  { $lte: ['$$repetitions', +max] },
                ],
              },
            },
          },
        },
      },
    ])

    // if we don't get exactly one thing back, that's a problem because
    // we're fetching by ID
    if (habitRepetitions.length !== 1)
      return res.status(400).send({ message: 'Unable to fetch repetitions' })

    return res.send(habitRepetitions[0].repetitions)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

export default router
