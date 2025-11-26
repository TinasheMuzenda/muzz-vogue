import cloudinary from "../config/cloudinaryConfig.jsx";

export const uploadBuffer = (buffer, folder = "mern_ecom") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) return reject(err);
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    );
    stream.end(buffer);
  });
};
