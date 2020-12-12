import config from 'config'
import jwt from 'jsonwebtoken'
import { Req, Res, Next, Token } from '../utils/generic-types'

export default (req: Req, res: Res, next: Next) => {
  const token = req.header('trackbuddy-token')
  if (!token) return res.status(401).send({ message: 'Missing token' })

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret')) as Token
    req.userId = decoded.id

    // TODO: remove this timeout before release
    setTimeout(() => {
      next()
    }, 1000)
  } catch (err) {
    console.log(err)
    return res.status(401).send({ message: 'Invalid token' })
  }
}
