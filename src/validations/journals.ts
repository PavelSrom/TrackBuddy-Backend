import Joi from 'joi'

export const newJournalValidation = Joi.object({
  mood: Joi.number().integer().min(1).max(5).required(),
  standout: Joi.string().required(),
  wentWell: Joi.string().required(),
  wentWrong: Joi.string().required(),
  betterNextTime: Joi.string().required(),
  excuses: Joi.string().allow(''),
  tags: Joi.array().items(Joi.string()),
})
