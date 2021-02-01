import Joi from 'joi'

export const newHabitValidation = Joi.object({
  name: Joi.string().required(),
  color: Joi.string().required(),
  duration: Joi.number().required(),
  frequency: Joi.number().required(),
  description: Joi.string().allow(''),
})
