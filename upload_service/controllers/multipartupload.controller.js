import AWS from 'aws-sdk';
import fs from 'fs'
const multiPartUploadFileToS3 = async(req, res) => {
    const filePath = '/Users/onech/Downloads/WhatsApp Video 2024-05-21 at 05.26.30_eb708aac.mp4';
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        console.log('File does not exist: ', filePath);
        return;
    }
    AWS.config.update({
        region: 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const s3 = new AWS.S3();
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: 'trial-key',
        ContentType: 'video/mp4'
    };

    try{
        console.log('Creating MultiPart Upload');
        const multipartParams = await s3.createMultipartUpload(uploadParams).promise();
        const fileSize = fs.statSync(filePath).size;
        const chunkSize = 5 * 1024 * 1024; // 5 MB
        const numParts = Math.ceil(fileSize / chunkSize);

        const uploadedETags = [];

        for (let i=0; i<numParts; i++) {
            const start = i*chunkSize;
            const end = Math.min(start+chunkSize, fileSize);

            const partParams = {
                Bucket: uploadParams.Bucket,
                Key: uploadParams.Key,
                UploadId: multipartParams.UploadId,
                PartNumber: i+1,
                Body: fs.createReadStream(filePath, {start, end}),
                ContentLength: end-start
            }

            const data = await s3.uploadPart(partParams).promise();
            console.log('Uploaded part ${i+1}: ${data.Etag}');
            uploadedETags.push({ PartNumber: i+1, ETag: data.ETag});
        }

        const completeParams = {
            Bucket: uploadParams.Bucket,
            Key: uploadParams.Key,
            UploadId: multipartParams.UploadId,
            MultipartUpload: { Parts: uploadedETags }
        }

        console.log('Completing MultiPart Upload')
        const completeRes = await s3.completeMultipartUpload(completeParams).promise();
        console.log(completeRes);

        console.log('File uploaded successfully');
        res.status(200).send('File uploaded successfully');
    } catch (err) {
        console.log('Error uploading file:', err);
        res.status(500).send('File could not be uploaded');
    }
};
export default multiPartUploadFileToS3;

