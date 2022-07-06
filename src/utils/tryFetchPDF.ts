import Axios from 'axios';

const tryFetchPDF = async (url: string) => {
    let { data }: { data: any } = await Axios({
        method: 'GET',
        url,
        headers: {
            Accept: 'application/pdf',
        },
        responseType: 'arraybuffer',
    });
    if (!data) {
        throw new Error(
            `Failed to retrieve PDF, check if url is valid: ${url}`
        );
    }
    console.log({ pdfData: data });

    /*
  let buffer = Buffer.from(data);
  res.set({
    "Cache-Control": "public",
    "Content-Type": "application/pdf",
    "Content-Length": buffer.length,
    "Content-Transfer-Encoding": "binary",
    "Accept-Ranges": "bytes",
  });
  */

    return data;
};

export default tryFetchPDF;
