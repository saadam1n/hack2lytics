
export type CodeFile = {
    extension: string;
    content: string;
}

/**
 * Parses the content of a code file and returns an object with the filename and the content of the file.
 * @param {Buffer} content Content of the file
 * @param {string} filename Name of the file
 * @returns {*}  {Promise<CodeFile>}
 */
export async function parseCodeFile(content: Buffer, filename: string): Promise<CodeFile> {
    //truncate the buffer to 500kb
    const truncatedContent = content.subarray(0, 500 * 1024);
    const truncatedContentString = truncatedContent.toString();

    const ext = filename.split('.').pop() ?? '';

    return {
        extension: ext,
        content: truncatedContentString
    };

}