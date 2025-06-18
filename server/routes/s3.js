import express from "express";
import { db } from "../db/index.js";
import multer from "multer";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";



const S3Router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
});

// upload image to S3
S3Router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileKey = `images/${Date.now()}-${req.file.originalname}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3Client.send(command);

    const s3url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return res.status(201).json({
      message: "Image uploaded successfully",
      fileUrl: s3url,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error uploading image" });
  }
});

S3Router.get("/item/:itemId/images", async (req, res) => {
  const { itemId } = req.params;
  try {
    const result = await db.query("SELECT image_url FROM images WHERE item_id = $1", [itemId]);
    const rows = result.rows; 
    const urls = rows.map(row =>
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${row.image_url}`
    );
    res.json({ images: urls });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

S3Router.get("/signed-url/:key", async (req, res) => {
  const { key } = req.params;
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    res.json({ url: signedUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
});

// // Get image URL from S3
// S3Router.get("/image/:key", async (req, res) => {
//     const fileKey = req.params.key;
//     //Get the file URL from S3, and return it safely using the structure above
// });


export {S3Router};
