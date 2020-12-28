import { model, Schema, Document } from 'mongoose'
import { NotificationASR } from 'trackbuddy-shared/responses/notifications'

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

export default model<Document & NotificationASR>('Notification', NotificationSchema)
