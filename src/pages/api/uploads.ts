import nextConnect from 'next-connect';
// import multer from 'multer';
import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: './public/uploads',
//     filename: (req, file, cb) => cb(null, file.originalname),
//   }),
// });

// const apiRouter = nextConnect({
//   onError(error, req, res) {
//     res.status(501).json({ error: `Sorry something Happned! ${error.message}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });

// apiRouter.use(upload.array('theFiles'));

// apiRouter.post((req, res) => {
//   res.status(200).json({ data: 'success' });
// });

// export default apiRouter;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function image(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
      });

      form.once('error', console.error);
      form
        .on('fileBegin', (name, file) => {
          console.log('start uploading: ', file.name);
        })
        .on('aborted', () => console.log('Aborted...'));
      form.once('end', () => {
        console.log('Done!');
      });

      form.parse(req, async (err, fields, files) => {
        console.log(files);

        if (err) {
          throw String(JSON.stringify(err, null, 2));
        }

        console.log('moving file: ', files.file.filepath, ' to ', `/uploads/${files.file.originalFilename}`);
        fs.renameSync(files.file.filepath, `public/uploads/${files.file.originalFilename}`);

        return res.status(200).json({ url: `/uploads/${files.file.originalFilename}` });
      });
    } catch (error) {
      console.log(error);
      return res.status(error.requestResult.statusCode).send(error.message);
    }
  }

  return res.status(400);
}

export default image;
