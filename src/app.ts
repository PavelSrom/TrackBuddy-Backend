import express, { Application, json } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
import { getKey } from './utils/get-key'

// import routes
import authRoutes from './routes/auth'
import journalRoutes from './routes/journals'

const app: Application = express()

app.use(json())
app.use(cors())
app.use(helmet())
app.use('/api/auth', authRoutes)
app.use('/api/journals', journalRoutes)

const PORT = process.env.PORT || 5000

mongoose
  .connect(getKey('MONGO_URI'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // eslint-disable-next-line
    app.listen(PORT, () => console.log(`Listening on ${PORT}`))
  })
