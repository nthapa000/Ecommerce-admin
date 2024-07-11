import multiparty from 'multiparty'
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
// to read the content of body
import fs from 'fs'
import mime from 'mime-types'
const bucketName = 'ecommerce-1-prototype'

export default async function handle(req,res){
    const form =new multiparty.Form();
    const {fields,files} = await new Promise((resolve,reject)=>{
        form.parse(req, async(err,fields,files)=>{
            if(err) reject(err);
            resolve({fields,files})
        })
    })

    console.log('length:',files.file.length);
    const client = new S3Client({
        region:'us-east-1',
        credentials:{
            accessKeyId:process.env.S3_ACCESS_KEY,
            secretAccessKey:process.env.S3_SECRET_ACCESS_KEY
        }
    });
    // From already known file name we want the extension of the file
    // In case we have several files
    const links = [];
    for(const file of files.file){
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '.'+ext;
        console.log({ext,file})
       await client.send(new PutObjectCommand({
            Bucket:bucketName,
            Key:newFilename,
            Body:fs.readFileSync(file.path),
            // So that the file is publically available and we can just give the link
            ACL:'public-read',
            ContentType:mime.lookup(file.path)
        }));
        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        links.push(link);
    }

    return res.json({links});
}

export const config = {
    api: {bodyParser:false},
}