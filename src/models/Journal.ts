import { model, Schema, Document } from 'mongoose'
import { JournalFullASR } from 'trackbuddy-shared/responses/journals'

const JournalSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isStarred: {
      type: Boolean,
      required: true,
      default: false,
    },
    mood: {
      type: Number,
      required: true,
    },
    standout: {
      type: String,
      required: true,
    },
    wentWell: {
      type: String,
      required: true,
    },
    wentWrong: {
      type: String,
      required: true,
    },
    betterNextTime: {
      type: String,
      required: true,
    },
    excuses: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

export default model<Document & JournalFullASR>('Journal', JournalSchema)
