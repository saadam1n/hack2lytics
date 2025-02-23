import busboy from 'busboy';
import { Request, Response } from 'express';
import { CodeFile, parseCodeFile } from '../../parsers/parseCodeFile';
import { sendPrompt } from '../../callers/sendPrompt';
import { SessionModel } from '../../db/init';

export const sendMessage = async (req: Request, res: Response): Promise<void> => {

    const bb = busboy({ headers: req.headers });
    const files: CodeFile[] = [];
    const fields = {
        prompt: '',
        web_request: '',
        sessionid: ''
    };

    bb.on('file', async (name, file, info) => {
        const { filename } = info;
        const buf = Buffer.alloc(1000);
        file.on('data', (data: Buffer) => {
            buf.write(data.toString());
        }).on('close', async () => {
            files.push(await parseCodeFile(buf, filename));
        });
    }
    );
    bb.on('field', (fieldname: string, val) => {
        if (fieldname === 'prompt') {
            fields.prompt = val;
        }
        else if (fieldname === 'web_request') {
            fields.web_request = val;
        }
        else if (fieldname === 'sessionid') {
            fields.sessionid = val;
        }
    });
    bb.on('close', async () => {
        console.log('Done parsing form, sending relay');

        const sessionid: string = fields.sessionid;
        const entry = await SessionModel.findOne({ sessionid: sessionid });
        if (entry === null) {
            res.status(401).send("Unauthorized");
            return;
        }
        const threadid = entry!.userid as string;

        const resp = await sendPrompt(threadid, fields.prompt, files[0], fields.web_request);
        res.send(resp);
    });
    req.pipe(bb);
};