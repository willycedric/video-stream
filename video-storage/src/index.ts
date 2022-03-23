import * as express from 'express';
import {unlink} from 'fs';
import * as util from 'util';
import * as multer from 'multer';
import {uploadFile, getFileStream} from './s3';

const unlinkFile = util.promisify(unlink)

const upload = multer({ dest: 'uploads/' })
const app = express()

app.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
});

app.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file
  console.log(file)

  // apply filter
  // resize 

  const result = await uploadFile(file)
  await unlinkFile(file.path)
  console.log(result)
  const description = req.body.description
  res.send({imagePath: `/images/${result.Key}`})
});


app.listen(3000, () => console.log("listening on port 3000"))