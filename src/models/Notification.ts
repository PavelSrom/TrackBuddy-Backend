import { model, Schema, Document } from 'mongoose'

const NotificationSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// TODO: add notification type to trackbuddy-shared

export default model<Document & any>('Notification', NotificationSchema)
