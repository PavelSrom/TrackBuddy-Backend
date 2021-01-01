import { model, Schema, Document } from 'mongoose'

const ProfileSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  tags: {
    type: [String],
    required: true,
    default: [],
  },
})

// TODO: adjust type
export default model<Document & any>('Profile', ProfileSchema)
