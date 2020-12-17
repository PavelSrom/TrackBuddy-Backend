import jwt from 'jsonwebtoken'
import { Req, Res, Next, Token } from '../utils/generic-types'
import { getKey } from '../utils/get-key'

export default (req: Req, res: Res, next: Next) => {
  const token = req.header('trackbuddy-token')
  if (!token) return res.status(401).send({ message: 'Missing token' })

  try {
    const decoded = jwt.verify(token, getKey('JWT_SECRET')) as Token
    req.userId = decoded.id

    next()
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token' })
  }
}
