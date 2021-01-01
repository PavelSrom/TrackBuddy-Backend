import express, { Application, json } from 'express'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
import { getKey } from './utils/get-key'

// import routes
import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import journalRoutes from './routes/journals'
import habitRoutes from './routes/habits'

const app: Application = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // limit each IP to 100 requests in production or 1000 when not in production
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
})

// TODO: add XSS protection

app.use(json())
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(limiter)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/journals', journalRoutes)
app.use('/api/habits', habitRoutes)

const PORT = process.env.PORT || 5000

mongoose
  .connect(getKey('MONGO_URI'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    // eslint-disable-next-line
    app.listen(PORT, () => console.log(`Listening on ${PORT}`))
  })
