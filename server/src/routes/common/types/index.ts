import { Response, Request } from 'express';
import { IUser } from '@src/models/User';

/******************************************************************************
                                Types
******************************************************************************/

// Extend Express Request to include user from JWT middleware
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}

type TRecord = Record<string, unknown>;
export type IReq = Request<TRecord, void, TRecord, TRecord>;
export type IRes = Response<unknown, TRecord>;

