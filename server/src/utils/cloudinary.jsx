import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export const uploadToCloudinary = async (
  base64OrPath,
  folder = "mern_ecom"
) => {
  const result = await cloudinary.v2.uploader.upload(base64OrPath, {
    folder,
    resource_type: "image",
  });
  return result.secure_url;
};
