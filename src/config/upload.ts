import multer from 'multer';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

export default {
  directory: resolve(__dirname, '..', '..', 'tmp'),
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp'),
    filename(req, file, cb) {
      const pre = randomBytes(8).toString('HEX');
      const fileName = `${pre}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};
