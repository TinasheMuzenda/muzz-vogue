import dotenv from "dotenv";
dotenv.config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const adminCredentialAuth = (req, res, next) => {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error("❌ Admin credentials not found");
    return res.status(500).json({ error: "Server admin config error" });
  }

  req.adminCredential = {
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
  };

  next();
};
