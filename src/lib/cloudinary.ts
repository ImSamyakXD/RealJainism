import { v2 as cloudinary } from 'cloudinary';

// Server-side only. Never import this file from a 'use client' component —
// it relies on CLOUDINARY_API_SECRET, which must never reach the browser.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
