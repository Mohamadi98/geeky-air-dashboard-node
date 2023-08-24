const admin = require('firebase-admin');
const dotenv = require('dotenv')
const serviceAccount = require('../../dashboard-chris-firebase-adminsdk-7tyh2-346379d694.json')

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const upload_logo = async (base64Image, business_name) => {
    const split_on_semicolon = base64Image.split(';')[0];
    const image_extension = split_on_semicolon.split('/')[1];
    const modified_base64 = base64Image.split(',')[1];
    const filename = `${business_name}-logo`;
    const bucket = admin.storage().bucket();
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
        const bucket = admin.storage().bucket();
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
        console.log(images_url_list);
        return images_url_list;
}

module.exports = {
    upload_logo: upload_logo,
    upload_business_images, upload_business_images
}