import { model, Schema, Document } from 'mongoose'

const habitSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  frequency: {
    // every X days
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  repetitions: {
    type: [Number],
    required: true,
    default: [],
  },
})

export default model<Document & any>('Habit', habitSchema)
