"use client";
import React, { useState } from 'react';
import axios from 'axios';
//import { headers } from 'next/headers';

const uploadForm = () =>{
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange =(e) =>{
    // sets the first file in the event target
    setSelectedFile(e.target.files[0])
  }
  const handleUpload = async () => {
    try{
      const formData = new FormData();
      formData.append('filename', selectedFile.name);
      console.log(formData);
      //First request - PART 1
      const initializeRes = await axios.post('http://localhost:8080/upload/initialize', formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const {uploadId} = initializeRes.data;
      console.log('Upload id is ', uploadId);

      // PART 2
      // chunking

      const chunkSize = 5 * 1024 * 1024; // 5 MB chunks
      const totalChunks = Math.ceil(selectedFile.size / chunkSize);
      let start = 0;
      for (let chunkIndex= 0; chunkIndex < totalChunks ; chunkIndex++ ){
        // If end of file is less than start+ chunkSize, slice will just end it withe the original file end
        const chunk = selectedFile.slice(start, start + chunkSize);
        start += chunkSize;
        const chunkFormData = new FormData();
        chunkFormData.append('filename', selectedFile.name);
        chunkFormData.append('chunk', chunk);
        chunkFormData.append('totalChunks', totalChunks);
        chunkFormData.append('chunkIndex', chunkIndex +1 );
        chunkFormData.append('uploadId', uploadId);
      

      //Second API request
        await axios.post('http://localhost:8080/upload', chunkFormData, {
          headers :{
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Part 3 and third api rqst
      const completeRes = await axios.post('http://localhost:8080/upload/complete', 
        {
          filename: selectedFile.name,
          totalChunks: totalChunks,
          uploadId: uploadId
        }
      );
      console.log(completeRes.data);
    }catch(e){
      console.log("error in uploading", e);
    }
  }
  return (
    <div className='m-10'>
      <form encType="multipart/form-data">
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="button" onClick={handleUpload} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2   mb-2" >
          Upload
        </button>
      </form>

    </div>

);
};
export default uploadForm;