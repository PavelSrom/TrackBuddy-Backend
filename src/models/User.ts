import { model, Schema, Document } from 'mongoose'
import { UserProfileASR } from 'trackbuddy-shared/responses/profile'

const UserSchema: Schema = new Schema({
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
  pwResetToken: {
    type: String,
  },
  pwTokenExpiration: {
    type: Number,
  },
})

export default model<Document & UserProfileASR>('User', UserSchema)
