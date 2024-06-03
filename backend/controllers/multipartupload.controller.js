import AWS from 'aws-sdk';
import fs from 'fs'


const multipartUploadFileToS3 = async( req, res ) =>{

    console.log('multi part upload req received.');
    const filePath = "/Users/swetha/Desktop/videoApp/backend/assets/Look-The-Part-Demo.mp4";
    if (!fs.existsSync(filePath)){
        console.log('File doesnot exist: ', filePath);
        return;
    
    }

    AWS.config.update({
        region : '',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const uploadParams ={
        Bucket : process.env.AWS_BUCKET,
        Key : "ltp-video",
        //ACL : "public-read",
        ContentType : "video/mp4"

    };
    const s3 = new AWS.S3();
    /*
    In multipart upload, we need three requests. 
    1. Initialize requests. In res, we will get upload ID

    2. upload part : in req, we will be giving upload id and part no
    - In res, we get ETag corresponding to every part no

    3. Complete upload - send [{part no, ETag}, ...], yousend part no and etag of eveery part.
    In this resp, we get ETAG - this is tag of complete upload
    */

    try{
        //Part 1
        console.log("Creating Multi part Upload");
        // Here we will get uploadID
        const mulipartParams= await s3.createMultipartUpload(uploadParams).promise();

        const fileSize = fs.statSync(filePath).size;
        // lets make each chunk 5 MB
        // AWS S3 - each part should be atleast 5MB except last part
        const chunkSize = 5 * 1024 * 1024
        const numParts = Math.ceil(fileSize /chunkSize );
        
        // Part 2


        // these will come from each part upload and we will takle them in array
        const uploadedETags = []
        for (let i =0; i < numParts; i++){
            const start = i* chunkSize;
            // If the last chunk is less, we will take fileSize
            const end = Math.min (start + chunkSize, fileSize );
            const partParams ={
                Bucket : uploadParams.Bucket,
                Key : uploadParams.Key,
                UploadId : mulipartParams.UploadId,
                PartNumber : i+1,
                Body : fs.createReadStream(filePath, {start, end}),
                ContentLength : end - start

            }
            //second API call
            const data = await s3.uploadPart(partParams).promise();
            // in this date we will get Etag
            console.log(`The ETag of uploaded part ${i+1} is ${data.ETag}`);
            uploadedETags.push({PartNumber: partParams.PartNumber , ETag : data.ETag});
        }

        // {Part 3}
        const completeParams = {
            Bucket : uploadParams.Bucket,
            Key : uploadParams.Key,
            UploadId : mulipartParams.UploadId,
            MultipartUpload : {
                Parts : uploadedETags
            }
        };

        // 3rd api
        const completeres = await s3.completeMultipartUpload(completeParams).promise();
        console.log(` The Etag of complete uploaded video is  ${completeres.ETag}`);
        console.log("File uploaded successfully");
        res.status(200).send('File uploaded success');

    }catch(e){
        console.log("Error uploading file: ", e);
        res.status(500).send("File can't be uploaded")
    }

};
export default multipartUploadFileToS3;