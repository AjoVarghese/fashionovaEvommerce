require('dotenv').config(); 

console.log("hiii");

const cloudinary=require('cloudinary').v2;
console.log("ENV");
console.log(process.env.cloud_name);
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
})

module.exports=cloudinary