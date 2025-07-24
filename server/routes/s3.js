import express from "express";
import { db } from "../db/index.js";
import multer from "multer";
import NodeCache from "node-cache";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3Router = express.Router();

const imageCache = new NodeCache({ 
  stdTTL: 7200,
  checkperiod: 1200,
  maxKeys: 2000,
  deleteOnExpire: true
});

const dbCache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 600,
  maxKeys: 1000,
  useClones: false
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
  maxAttempts: 3,
  retryMode: "adaptive",
  requestHandler: {
    connectionTimeout: 5000,
    socketTimeout: 10000,
  }
});

const constructS3Url = (imageUrl) => {
  if (!imageUrl) return null;
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const cleanKey = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${cleanKey}`;
};

// Upload image to S3
S3Router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileKey = `images/${Date.now()}-${req.file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3Client.send(command);

    const s3url = constructS3Url(fileKey);

    if (req.body.itemId) {
      imageCache.del(`item_images_${req.body.itemId}`);
      dbCache.del(`db_images_${req.body.itemId}`);
    }

    return res.status(201).json({
      message: "Image uploaded successfully",
      fileUrl: s3url,
    });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return res.status(500).json({ error: "Error uploading image" });
  }
});

// Optimized image fetching with better caching strategy
S3Router.get("/item/:itemId/images", async (req, res) => {
  const { itemId } = req.params;
  const imageCacheKey = `item_images_${itemId}`;
  const dbCacheKey = `db_images_${itemId}`;

  try {
    // First check the final image URL cache
    const cachedImages = imageCache.get(imageCacheKey);
    if (cachedImages) {
      // Set browser cache headers
      res.set({
        'Cache-Control': 'public, max-age=3600',
        'ETag': `"${itemId}-${cachedImages.length}"`
      });
      
      return res.json({ 
        images: cachedImages,
        cached: true 
      });
    }

    // Check if we have DB results cached 
    let dbResults = dbCache.get(dbCacheKey);
    
    if (!dbResults) {
      // Fetch from database with optimized query
      const result = await db.query(
        "SELECT image_url FROM images WHERE item_id = $1 ORDER BY created_at ASC",
        [itemId]
      );
      
      dbResults = result.rows;
      
      // Cache DB results separately (shorter TTL for DB cache)
      dbCache.set(dbCacheKey, dbResults, 1800); // 30 minutes
    }

    // Process URLs
    if (!dbResults || dbResults.length === 0) {
      // Cache empty results to prevent repeated DB calls
      const emptyResult = [];
      imageCache.set(imageCacheKey, emptyResult, 1800); // 30 minutes for empty
      
      res.set({
        'Cache-Control': 'public, max-age=1800'
      });
      
      return res.json({ 
        images: emptyResult,
        cached: false 
      });
    }

    // Construct URLs
    const urls = dbResults
      .map(row => constructS3Url(row.image_url))
      .filter(url => url !== null); // Remove any null URLs

    // Cache the final URLs with longer TTL
    imageCache.set(imageCacheKey, urls);

    // Set response headers for browser caching
    res.set({
      'Cache-Control': 'public, max-age=3600',
      'ETag': `"${itemId}-${urls.length}"`
    });

    res.json({ 
      images: urls,
      cached: false 
    });

  } catch (err) {
    console.error("Error fetching images for item", itemId, ":", err);
    
    // Return empty array instead of error to prevent frontend crashes
    res.status(200).json({ 
      images: [],
      error: "Failed to fetch images",
      cached: false 
    });
  }
});

// Batch image fetching for multiple items (performance optimization)
S3Router.post("/items/images/batch", async (req, res) => {
  const { itemIds } = req.body;
  
  if (!Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ error: "Invalid item IDs array" });
  }

  // Limit batch size to prevent overload
  if (itemIds.length > 50) {
    return res.status(400).json({ error: "Too many items requested. Maximum 50 items per batch." });
  }

  try {
    const results = {};
    const uncachedIds = [];

    // Check cache for all items first
    for (const itemId of itemIds) {
      const cacheKey = `item_images_${itemId}`;
      const cached = imageCache.get(cacheKey);
      if (cached) {
        results[itemId] = cached;
      } else {
        uncachedIds.push(itemId);
      }
    }

    // Fetch uncached items in one optimized query
    if (uncachedIds.length > 0) {
      const placeholders = uncachedIds.map((_, i) => `$${i + 1}`).join(',');
      const query = `
        SELECT item_id, image_url 
        FROM images 
        WHERE item_id IN (${placeholders})
        ORDER BY item_id, created_at ASC
      `;
      
      const result = await db.query(query, uncachedIds);
      
      // Group results by item_id
      const grouped = {};
      result.rows.forEach(row => {
        if (!grouped[row.item_id]) {
          grouped[row.item_id] = [];
        }
        const url = constructS3Url(row.image_url);
        if (url) {
          grouped[row.item_id].push(url);
        }
      });

      // Cache results and add to response
      uncachedIds.forEach(itemId => {
        const urls = grouped[itemId] || [];
        imageCache.set(`item_images_${itemId}`, urls);
        results[itemId] = urls;
      });
    }

    // Set browser cache headers
    res.set({
      'Cache-Control': 'public, max-age=1800',
      'Content-Type': 'application/json'
    });

    res.json({ results });

  } catch (err) {
    console.error("Error in batch image fetch:", err);
    res.status(500).json({ error: "Failed to fetch batch images" });
  }
});

// Get signed URL with caching (for private content)
S3Router.get("/signed-url/:key", async (req, res) => {
  const { key } = req.params;
  const cacheKey = `signed_url_${key}`;

  try {
    // Check cache first (signed URLs expire, so shorter TTL)
    const cachedUrl = imageCache.get(cacheKey);
    if (cachedUrl) {
      return res.json({ 
        url: cachedUrl,
        cached: true 
      });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    // Cache with shorter TTL (50 minutes to be safe)
    imageCache.set(cacheKey, signedUrl, 3000);

    res.json({ 
      url: signedUrl,
      cached: false 
    });

  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
});

// Health check endpoint
S3Router.get("/health", (req, res) => {
  const imageStats = imageCache.getStats();
  const dbStats = dbCache.getStats();
  
  res.json({
    status: "healthy",
    caches: {
      images: {
        keys: imageCache.keys().length,
        stats: imageStats
      },
      database: {
        keys: dbCache.keys().length,
        stats: dbStats
      }
    },
    uptime: process.uptime()
  });
});

// Cache management endpoints
S3Router.delete("/cache/clear", (req, res) => {
  imageCache.flushAll();
  dbCache.flushAll();
  res.json({ message: "All caches cleared successfully" });
});

S3Router.delete("/cache/images", (req, res) => {
  imageCache.flushAll();
  res.json({ message: "Image cache cleared successfully" });
});

S3Router.delete("/cache/db", (req, res) => {
  dbCache.flushAll();
  res.json({ message: "Database cache cleared successfully" });
});

S3Router.get("/cache/stats", (req, res) => {
  const imageStats = imageCache.getStats();
  const dbStats = dbCache.getStats();
  
  res.json({
    images: {
      stats: imageStats,
      keys: imageCache.keys().length,
      memoryUsage: process.memoryUsage()
    },
    database: {
      stats: dbStats,
      keys: dbCache.keys().length
    }
  });
});

// Cache specific item images
S3Router.delete("/cache/item/:itemId", (req, res) => {
  const { itemId } = req.params;
  const imageCacheKey = `item_images_${itemId}`;
  const dbCacheKey = `db_images_${itemId}`;
  
  const imageDeleted = imageCache.del(imageCacheKey);
  const dbDeleted = dbCache.del(dbCacheKey);
  
  res.json({ 
    message: `Cache cleared for item ${itemId}`,
    imageCache: imageDeleted ? "cleared" : "not found",
    dbCache: dbDeleted ? "cleared" : "not found",
    itemId 
  });
});

// Warm up cache for frequently accessed items
S3Router.post("/cache/warmup", async (req, res) => {
  const { itemIds } = req.body;
  
  if (!Array.isArray(itemIds)) {
    return res.status(400).json({ error: "itemIds must be an array" });
  }

  try {
    let warmedUp = 0;
    
    for (const itemId of itemIds.slice(0, 20)) { // Limit to 20 items
      const cacheKey = `item_images_${itemId}`;
      
      if (!imageCache.get(cacheKey)) {
        // Trigger cache population
        try {
          const result = await db.query(
            "SELECT image_url FROM images WHERE item_id = $1 ORDER BY created_at ASC",
            [itemId]
          );
          
          const urls = result.rows
            .map(row => constructS3Url(row.image_url))
            .filter(url => url !== null);
          
          imageCache.set(cacheKey, urls);
          warmedUp++;
        } catch (err) {
          console.warn(`Failed to warm up cache for item ${itemId}:`, err.message);
        }
      }
    }
    
    res.json({ 
      message: `Cache warmed up for ${warmedUp} items`,
      warmedUp,
      requested: itemIds.length 
    });
    
  } catch (err) {
    console.error("Error warming up cache:", err);
    res.status(500).json({ error: "Failed to warm up cache" });
  }
});

export { S3Router };