import { Request, Response } from "express";
import { v4 } from "uuid";
import { SessionModel } from "../../db/init";

export const createSession = async (req: Request, res: Response): Promise<void> => {
    const newUserId = "123"; //await makeNewSession();
    const newSessionId = v4();

    try {
        SessionModel.create({
            sessionid: newSessionId,
            userid: newUserId,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
        });
        res.status(200).send({ id: newSessionId });
    }
    catch (error) {
        res.status(500).send("Internal server error");
        return;
    }

};