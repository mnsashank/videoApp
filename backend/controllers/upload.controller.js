import AWS from 'aws-sdk';
//import fs from 'fs'
import process from "process";
// Part 1 - InitializeUpload
export const initializeUpload = async (req, res) => {
    try{
        console.log("Initializing upload");
        const {filename} = req.body;
        console.log(filename);
       
        const s3 = new AWS.S3({
            region : '',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        const createParams ={
            Bucket : process.env.AWS_BUCKET,
            Key : filename,
            //ACL : "public-read",
            ContentType : "video/mp4"
    
        };
        console.log(createParams)
        const multipartParams= await s3.createMultipartUpload(createParams).promise();
        console.log("multipartParams ----- ", multipartParams);
        const uploadId = multipartParams.UploadId;
        console.log(uploadId)
        res.status(200).json({ uploadId });
    }catch(e){
        console.log("Error Initializing file: ", e);
        res.status(500).send("File can't be uploaded")
    }
};
// Part 2 - Upload chunk
export const uploadChunk = async (req, res) =>{
    try{
        console.log("Uploading chunk:"); 
        console.log(req.body);
        const { filename, chunkIndex, uploadId } = req.body;

        const s3 = new AWS.S3({
            region : '',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        const partParams ={
            Bucket : process.env.AWS_BUCKET,
            Key : filename,
            UploadId : uploadId,
            PartNumber : chunkIndex,
            Body : req.file.buffer,
        }

        const data = await s3.uploadPart(partParams).promise();
        console.log("data------- ", data);
        res.status(200).json({ success: true });
    } catch(e){
        console.log("Error Uploading Chunk: ", e);
        res.status(500).send("Chunk can't be uploaded")
    }
}
// Part 3 - Complete Upload
export const completeUpload = async (req, res) =>{
    try{
        console.log('completing upload');
        const {filename, totalChunks, uploadId} = req.body;
        
        const s3 = new AWS.S3({
            region : '',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        const completeParams ={
            Bucket : process.env.AWS_BUCKET,
            UploadId : uploadId,
            Key : filename,
           
        }
        // We are getting parts info from S3 directly, bcz we are not saving in frontend, not needed.
        // Listing parts using promise
        const data = await s3.listParts(completeParams).promise();
        const parts = data.Parts.map(part => ({
            ETag: part.ETag,
            PartNumber: part.PartNumber
        }));
        completeParams. MultipartUpload = {
            Parts : parts
        }
        const uploadResult = await s3.completeMultipartUpload(completeParams).promise();
        console.log("data----- ", uploadResult);
        return res.status(200).json({ message: "Uploaded successfully!!!" });

    }catch(e){
        console.log("Error completing Upload: ", e);
        res.status(500).send("Uploading can't be completed");
    }
}

