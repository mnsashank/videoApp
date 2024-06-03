import express from "express"
import {uploadChunk, initializeUpload, completeUpload} from '../controllers/upload.controller.js'

import multer from 'multer';
const upload = multer();

const router = express.Router();
//initialize
router.post('/initialize', upload.none(), initializeUpload);
//upload single chunk
router.post('/' ,upload.single('chunk'), uploadChunk);
//complete upload
router.post('/complete', completeUpload);
export default router;