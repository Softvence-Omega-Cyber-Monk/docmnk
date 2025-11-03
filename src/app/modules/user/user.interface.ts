import { Types } from "mongoose"

export type TUser = {
    name?: string,
    accountId?: Types.ObjectId
}