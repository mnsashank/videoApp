import express from "express";

import multipartUploadFileToS3 from "../controllers/multipartupload.controller.js";
const router = express.Router();

router.post('/', multipartUploadFileToS3);

export default router;