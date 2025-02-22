import mongoose from 'mongoose';
import { config } from "../util/env";

mongoose.connect(config.dbConnect);

export const SessionModel = mongoose.model("Session", new mongoose.Schema({
    sessionid: String,
    userid: String,
    expires: Date
}));