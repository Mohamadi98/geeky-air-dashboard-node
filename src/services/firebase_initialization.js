const admin = require('firebase-admin');
const dotenv = require('dotenv')

dotenv.config();

const firebaseAgent = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace newline characters
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

const upload_admin_image = async (base64Image, admin_name) => {
    const split_on_semicolon = base64Image.split(';')[0];
    const image_extension = split_on_semicolon.split('/')[1];
    const modified_base64 = base64Image.split(',')[1];
    const filename = `${admin_name}-image`;
    const bucket = firebaseAgent.storage().bucket();
    const imageBuffer = Buffer.from(modified_base64, 'base64');
  
    const file = bucket.file(filename);
    await file.save(imageBuffer, {
        metadata: {
            contentType: `image/${image_extension}`, 
        },
    });
  
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500', 
    });
    
    return url;
}

const upload_logo = async (base64Image, business_name) => {
    const split_on_semicolon = base64Image.split(';')[0];
    const image_extension = split_on_semicolon.split('/')[1];
    const modified_base64 = base64Image.split(',')[1];
    const filename = `${business_name}-logo`;
    const bucket = firebaseAgent.storage().bucket();
    const imageBuffer = Buffer.from(modified_base64, 'base64');
  
    const file = bucket.file(filename);
    await file.save(imageBuffer, {
        metadata: {
            contentType: `image/${image_extension}`, 
        },
    });
  
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500', 
    });
    
    return url;
}

const upload_business_images = async (images_arr, business_name) => {
    let counter = 1;
    let images_url_list = [];
    for (const image of images_arr) {
        const split_on_semicolon = image.split(';')[0];
        const image_extension = split_on_semicolon.split('/')[1];
        const modified_base64 = image.split(',')[1];
        const filename = `${business_name}-image-${counter}`;
        const bucket = firebaseAgent.storage().bucket();
        const imageBuffer = Buffer.from(modified_base64, 'base64');
  
        const file = bucket.file(filename);
        await file.save(imageBuffer, {
            metadata: {
                contentType: `image/${image_extension}`, 
            },
        });
  
        const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
        });

        images_url_list.push(url);
        counter++;
        };
        return images_url_list;
}

// const upload_business_video = async (base64_video, business_name) => {
//     const split_on_semicolon = base64_video.split(';')[0];
//     const image_extension = split_on_semicolon.split('/')[1];
//     const modified_base64 = base64_video.split(',')[1];
//     const filename = `${business_name}-video`;
//     const bucket = admin.storage().bucket();
//     const imageBuffer = Buffer.from(modified_base64, 'base64');
  
//     const file = bucket.file(filename);
//     await file.save(imageBuffer, {
//         metadata: {
//             contentType: `image/${image_extension}`, 
//         },
//     });
  
//     const [url] = await file.getSignedUrl({
//         action: 'read',
//         expires: '03-01-2500', 
//     });
    
//     return url;
// }

module.exports = {
    upload_logo: upload_logo,
    upload_business_images, upload_business_images,
    upload_admin_image: upload_admin_image,
    // upload_business_video: upload_business_video
}