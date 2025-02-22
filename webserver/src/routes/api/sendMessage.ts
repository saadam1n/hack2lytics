import busboy from 'busboy';
import { Request, Response } from 'express';
import { parseCodeFile } from '../../parsers/parseCodeFile';

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const bb = busboy({ headers: req.headers });
    const files = [];

    bb.on('file', (name, file, info) => {
        const { filename } = info;
        const buf = Buffer.alloc(1000);
        file.on('data', (data: Buffer) => {
            buf.write(data.toString());
        }).on('close', () => {
            files.push(parseCodeFile(buf, filename));
        });
    }
    );
    bb.on('field', (fieldname, val) => {
        console.log(`Field [${fieldname}]: value: ${val}`);
    });
    bb.on('close', () => {
        console.log('Done parsing form!');
        res.writeHead(303, { Connection: 'close', Location: '/' });
        res.end();
    });
    req.pipe(bb);
};