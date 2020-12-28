import { Router } from 'express'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import { JournalBriefASR, JournalFullASR } from 'trackbuddy-shared/responses/journals'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'
import auth from '../middleware/auth'
import Journal from '../models/Journal'
import { Req, Res } from '../utils/generic-types'
import { newJournalValidation } from '../validations/journals'

const router = Router()

/**
 * @description get all brief journals
 */

type FilterOptions = {
  created?: {
    $lte: number
    $gte: number
  }
  isStarred: boolean
}

type SortByOptions = {
  created?: number
  mood?: number
}

router.get('/', auth, async (req: Req, res: Res<JournalBriefASR[]>) => {
  const { month, year, favorites, sortBy } = req.query

  const minMonth = startOfMonth(new Date(+year!, +month!, 15))
  const maxMonth = endOfMonth(new Date(+year!, +month!, 15))

  const filterOptions: FilterOptions = {
    created: {
      $lte: maxMonth.getTime(),
      $gte: minMonth.getTime(),
    },
    isStarred: favorites === 'true',
  }

  const sortByOptions: SortByOptions = {}
  if (sortBy === 'newest') sortByOptions.created = -1
  if (sortBy === 'oldest') sortByOptions.created = 1
  if (sortBy === 'mood_asc') sortByOptions.mood = 1
  if (sortBy === 'mood_desc') sortByOptions.mood = -1

  try {
    const allJournals = await Journal.find({
      user: req.userId,
      ...filterOptions,
    })
      .sort(sortByOptions)
      .select('_id isStarred mood standout tags created')

    return res.send(allJournals)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

router.get('/today', auth, async (req: Req, res: Res<{ found: boolean }>) => {
  const now = new Date()

  try {
    const journalForToday = await Journal.findOne({
      user: req.userId,
      created: {
        $lte: endOfDay(now).getTime(),
        $gte: startOfDay(now).getTime(),
      },
    })

    return res.send({ found: !!journalForToday }) // !!{} = true
  } catch (err) {
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

/**
 * @description create a new journal entry
 */
router.post('/', auth, async (req: Req<JournalFullASP>, res: Res<JournalFullASR>) => {
  const { error } = newJournalValidation.validate(req.body)
  if (error) return res.status(400).send({ message: 'Invalid request' })

  const now = new Date()

  try {
    const journalForToday = await Journal.findOne({
      user: req.userId,
      created: {
        $lte: endOfDay(now).getTime(),
        $gte: startOfDay(now).getTime(),
      },
    })
    if (journalForToday)
      return res
        .status(400)
        .send({ message: 'Journal entry for today has been already created' })

    const newJournal = new Journal({
      user: req.userId,
      created: new Date().getTime(),
      ...req.body,
    })
    await newJournal.save()

    return res.status(201).send(newJournal)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description mark journal as starred
 */
router.post('/favorite/:id', auth, async (req: Req, res: Res<JournalFullASR>) => {
  try {
    const journalToEdit = await Journal.findById(req.params.id)
    if (!journalToEdit) return res.status(404).send({ message: 'Journal not found' })
    if (journalToEdit.isStarred)
      return res.status(400).send({ message: 'Journal already starred' })

    journalToEdit.isStarred = true
    await journalToEdit.save()

    return res.send(journalToEdit)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

/**
 * @description mark journal as unstarred
 */
router.delete('/favorite/:id', auth, async (req: Req, res: Res<JournalFullASR>) => {
  try {
    const journalToEdit = await Journal.findById(req.params.id)
    if (!journalToEdit) return res.status(404).send({ message: 'Journal not found' })
    if (!journalToEdit.isStarred)
      return res.status(400).send({ message: 'Journal already unstarred' })

    journalToEdit.isStarred = false
    await journalToEdit.save()

    return res.send(journalToEdit)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Server error' })
  }
})

export default router
