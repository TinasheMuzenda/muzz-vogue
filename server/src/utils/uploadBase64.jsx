import cloudinary from "../config/cloudinaryConfig.jsx";

export const uploadBase64 = async (base64String, folder = "mern_ecom") => {
  const result = await cloudinary.uploader.upload(base64String, {
    folder,
    resource_type: "image",
  });
  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};
