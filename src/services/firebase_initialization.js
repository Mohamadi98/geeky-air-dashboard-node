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
            contentType: `image/${image_extension}`, // Set the content type of your image
        },
    });
  
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500', // Set a distant future expiration date
    });
    
    return url;
}

module.exports = {
    upload_logo: upload_logo
}