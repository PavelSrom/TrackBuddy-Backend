import { Request, Response, NextFunction } from 'express'

// express
export interface Next extends NextFunction {}
export interface Res<T = {}> extends Response<{ message: string } | T> {}
export interface Req<T = {}> extends Request {
  body: T
  userId?: string
}

// JWT
export type Token = {
  id: string
}
