const axios = require("axios");
const { getProductById } = require("../access/products");

class ImageServices {
  constructor(pid) {
    this.pid = pid;
  }

  async getImagesGroupInfo() {
    const product = await getProductById(this.pid);
    if (product) {
      const imageGroupId = product.get("uploadcare_group_id");
      try {
        const groupInfo = await axios.get(
          `https://api.uploadcare.com/groups/${imageGroupId}/`,
          {
            headers: {
              Accept: "application/vnd.uploadcare-v0.5+json",
              Authorization:
                "Uploadcare.Simple " +
                process.env.UPLOADCARE_PUBLIC_KEY +
                ":" +
                process.env.UPLOADCARE_SECRET_KEY,
            },
          }
        );
        return groupInfo.data;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  }

  async getImagesUrls() {
    try {
      const groupInfo = await this.getImagesGroupInfo();
      const { files } = groupInfo;
      let urls = false;

      if (files && files.length) {
        urls = files.map((file) => file["original_file_url"]);
      }

      return urls;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = ImageServices;
