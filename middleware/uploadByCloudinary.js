import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { _id } = req.user;

    return {
      folder: "avatars",
      allowed_formats: ["jpg", "png"], // Adjust the allowed formats as needed
      public_id: _id, // Use original filename as the public ID
      transformation: { width: 28, height: 28 },
    };
  },
});

const upload = multer({ storage });

export default upload;

//controller
// const someFunc = async (req, res) => {
//   const avatarURL = req.file.path;
// };
