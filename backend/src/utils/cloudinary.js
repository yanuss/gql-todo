const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteCloudinaryImage = async public_id => {
  return await cloudinary.uploader.destroy(public_id, function(error, result) {
    if (error) {
      throw new Error(error);
    }
    if (result) {
      return result;
    }
  });
};

const getPublicId = url => {
  const parts = url.split("/");
  const result = `${parts[parts.length - 2]}/${
    parts[parts.length - 1].split(".")[0]
  }`;
  return result;
};

const deleteCloudinaryImageHandler = async image => {
  console.log("removing image");
  if (image) {
    const imageId = getPublicId(image);
    console.log(imageId);
    const res = await deleteCloudinaryImage(imageId);
    if (res && res.result === "not found") {
      throw new Error("Image not found");
    }
    if (res && res.result === "ok") {
      console.log("image removed");
      return { message: "Image deleted" };
    }
  }
};

module.exports.deleteCloudinaryImageHandler = deleteCloudinaryImageHandler;
module.exports.deleteCloudinaryImage = deleteCloudinaryImage;
module.exports.getPublicId = getPublicId;
