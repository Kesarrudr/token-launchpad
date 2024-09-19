import { FormData, metadataJson } from "@/lib/types";
import axios from "axios";

function extractPath(url: string): string {
  const startIndex = url.indexOf("token_Data");

  if (startIndex === -1) return "";

  const endIndex = url.indexOf("?", startIndex);

  const pathEndIndex = endIndex === -1 ? url.length : endIndex;

  const value =
    "https://d24kigf08msahl.cloudfront.net/" +
    url.substring(startIndex, pathEndIndex);

  return value;
}
async function uploadJson(formData: FormData) {
  try {
    const resposnse = await axios.get(
      "https://wallet-backend.kesartechnologies.software/url",
    );
    const { ImageUrl, DataUrl } = resposnse.data.message;

    const jsonData: metadataJson = {
      name: formData.name,
      symbol: formData.Symbol,
      description: formData.description,
      image: "",
      attribute: [],
    };
    if (formData.addSocials) {
      const links = {
        website: formData.website ?? "",
        twitter: formData.twitter ?? "",
        telegram: formData.telegram ?? "",
        discord: formData.discord ?? "",
      };
      jsonData.attribute.push(links);
    }

    if (formData && formData.image) {
      const imageUploadConfig = {
        method: "put",
        maxBodyLength: Infinity,
        url: ImageUrl,
        headers: {
          "Content-Type": formData.image.type, // Set the correct image content type (e.g., "image/jpeg" or "image/png")
        },
        withCredentials: false,
        data: formData.image,
      };

      await axios.request(imageUploadConfig);
      const imageUrl = extractPath(ImageUrl);

      jsonData.image = imageUrl;

      const dataUpdateConfig = {
        method: "put",
        maxBodyLength: Infinity,
        url: DataUrl,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
        data: jsonData,
      };

      await axios.request(dataUpdateConfig);
      const jsonDataUrl = extractPath(DataUrl);
      return jsonDataUrl;
    }
  } catch (error) {
    console.log(error);
  }
}
const areFieldsValid = (formData: FormData): boolean => {
  return (
    formData.name.trim() !== "" &&
    formData.Symbol.trim() !== "" &&
    formData.image !== null && // Assuming image is a File or null
    formData.description.trim() !== ""
  );
};

export { uploadJson, areFieldsValid };
