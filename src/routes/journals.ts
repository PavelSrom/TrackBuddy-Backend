import { Router } from 'express'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import { JournalBriefASR, JournalFullASR } from 'trackbuddy-shared/responses/journals'
import auth from '../middleware/auth'
import Journal from '../models/Journal'
import { Req, Res } from '../utils/generic-types'

const router = Router()

/**
 * @description get all brief journals
 */
router.get('/', auth, async (req: Req, res: Res<JournalBriefASR[]>) => {
  try {
    const allJournals = await Journal.find({ user: req.userId }).select(
      '_id isStarred mood standout tags'
    )

    return res.send(allJournals)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description get full journal by id
 */
router.get('/:id', auth, async (req: Req, res: Res<JournalFullASR>) => {
  try {
    const fullJournal = await Journal.findById(req.params.id)
    if (!fullJournal) return res.status(404).send({ message: 'Journal not found' })

    return res.send(fullJournal)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

router.post('/', auth, async (req: Req<JournalFullASP>, res: Res<JournalFullASR>) => {
  // request stuff here

  try {
    const newJournal = new Journal({
      user: req.userId,
      ...req.body,
    })
    await newJournal.save()

    return res.status(201).send(newJournal)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

export default router
