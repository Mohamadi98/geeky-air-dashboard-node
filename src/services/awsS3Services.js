const AWS = require('aws-sdk')
const dotenv = require('dotenv')

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  });

const upload_admin_image_to_s3 = async (base64Image, adminName) => {
    try {
      const split_on_semicolon = base64Image.split(';')[0];
      const image_extension = split_on_semicolon.split('/')[1];
      const modified_base64 = base64Image.split(',')[1];
      const s3 = new AWS.S3();
      const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `admin-${adminName}-image`,
      Body: Buffer.from(modified_base64, 'base64'),
      ContentType: `image/${image_extension}`,
      ACL: 'public-read'
    }

    const result = await s3.upload(params).promise();
    return result.Location;

    } catch (error) {
        `error uploading the business logo to s3 bucket: ${error}`
    }
}

const upload_logo_to_s3 = async (base64Image, businessName) => {
    try {
      const split_on_semicolon = base64Image.split(';')[0];
      const image_extension = split_on_semicolon.split('/')[1];
      const modified_base64 = base64Image.split(',')[1];
      const s3 = new AWS.S3();
      const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${businessName}-logo`,
      Body: Buffer.from(modified_base64, 'base64'),
      ContentType: `image/${image_extension}`,
      ACL: 'public-read'
    }

    const result = await s3.upload(params).promise();
    return result.Location;

    } catch (error) {
        `error uploading the business logo to s3 bucket: ${error}`
    }
}

const upload_business_image_to_s3 = async (businessName, images_arr) => {
  try {
    let images_url_list = [];
    for (const image of images_arr) {
        if (image.length < 500) {
            images_url_list.push(image);
            continue;
        }
        const split_on_semicolon = image.split(';')[0];
        const image_extension = split_on_semicolon.split('/')[1];
        const modified_base64 = image.split(',')[1];
        const image_id = parseInt(Math.random() * 1000000);
        const s3 = new AWS.S3();
        const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${businessName}-image-${image_id}`,
        Body: Buffer.from(modified_base64, 'base64'),
        ContentType: `image/${image_extension}`,
        ACL: 'public-read'
        }

      const result = await s3.upload(params).promise();
      images_url_list.push(result.Location);
    }
  return images_url_list;

  } catch (error) {
      `error uploading business images to s3 bucket: ${error}`
  }
}

const upload_video_to_s3 = async (base64Video, businessName) => {
  try {
    const split_on_semicolon = base64Video.split(';')[0];
    const video_extension = split_on_semicolon.split('/')[1];
    const modified_base64 = base64Video.split(',')[1];
    const s3 = new AWS.S3();
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${businessName}-video`,
      Body: Buffer.from(modified_base64, 'base64'),
      ContentType: `video/${video_extension}`,
      ACL: 'public-read',
      ContentEncoding: 'base64'
    }

    const result = await s3.upload(params).promise();
    return result.Location;

  } catch (error) {
      `error uploading the video to s3 bucket: ${error}`
  }
}

module.exports = {
    upload_logo_to_s3: upload_logo_to_s3,
    upload_business_image_to_s3: upload_business_image_to_s3,
    upload_video_to_s3: upload_video_to_s3,
    upload_admin_image_to_s3: upload_admin_image_to_s3
}