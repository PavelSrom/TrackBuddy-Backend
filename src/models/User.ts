import { model, Schema, Document } from 'mongoose'
import { UserProfileASR } from 'trackbuddy-shared/responses/profile'

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
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

export default model<Document & UserProfileASR>('User', UserSchema)
