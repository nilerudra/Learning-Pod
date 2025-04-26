const pdfParse = require("pdf-parse");
const textract = require("textract");

const extractFileContent = async (file) => {
  try {
    if (file.mimetype === "application/pdf") {
      const dataBuffer = file.buffer;
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return new Promise((resolve, reject) => {
        textract.fromBufferWithMime(
          file.mimetype,
          file.buffer,
          (error, text) => {
            if (error) {
              reject(error);
            } else {
              resolve(text);
            }
          }
        );
      });
    } else if (file.mimetype === "text/plain") {
      return file.buffer.toString();
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error extracting file content:", error.message);
    throw new Error("Failed to extract file content");
  }
};

module.exports = { extractFileContent };
