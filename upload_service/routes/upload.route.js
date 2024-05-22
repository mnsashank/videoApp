import express from "express"
import multer from 'multer'
import multipartUploadFileToS3 from "../controllers/multipartupload.controller.js";

const router = express.Router();
router.post('/',  multipartUploadFileToS3);
export default router;