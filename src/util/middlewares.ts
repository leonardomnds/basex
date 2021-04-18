import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const multerUpload = multer({
  storage: multer.diskStorage({
    destination: './public/arquivos',
    filename: (req, file, cb) => cb(null, uuidv4()+file.originalname.substr(file.originalname.lastIndexOf('.'))),
  })
});