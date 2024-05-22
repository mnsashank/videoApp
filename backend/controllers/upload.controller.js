import AWS from 'aws-sdk';
import fs from 'fs'

const uploadFileToS3 = async( req, res ) =>{
    const filePath = '/Users/swetha/Desktop/videoApp/backend/assets/ub.png'

    if (!fs.existsSync(filePath)){
        console.log('File doesnot exist: ', filePath);
        return;
    
    }
    AWS.config.update({
        region : '',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: 'ub.jpg',
        Body: fs.createReadStream(filePath)
    };

    const s3= new AWS.S3();

    // upload file to s3
    s3.upload(params, (err,data) => {
        if (err){
            console.log('Error uploading file:', err);
            res.status(404).send('File could not be uploaded!');
        } else{
            console.log('File uploaded successfully. File location:', data.Location);
            res.status(200).send('File uploaded succesfully');
        }

    });
}

export default uploadFileToS3;
