const express = require("express");
const multer = require("multer");
const { bucket } = require("../config/firebaseAdmin");
const Pod = require("../models/pods");
const { extractFileContent } = require("../utils/extractContent");
const { contentWithLLM } = require("../utils/llmService");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  console.log("hit");
  const { podId, resource_name, uploaded_by } = req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const fileContent = await extractFileContent(req.file);
    console.log("Extracted Content:", fileContent);

    const folderName = await contentWithLLM(fileContent);
    console.log("Determined Folder:", folderName);

    console.log("Creating blob stream for upload...");

    const blob = bucket.file(req.file.originalname);
    console.log("first");
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    console.log("Created blob stream for upload...");

    blobStream.on("error", (err) => {
      console.error("Blob Stream Error:", err.message);
      res
        .status(500)
        .send({ message: "Failed to upload file to Firebase Cloud Storage." });
    });

    blobStream.on("finish", async () => {
      try {
        const [signedUrl] = await blob.getSignedUrl({
          action: "read",
          expires: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 365
          ).toISOString(),
        });

        const pod = await Pod.findByIdAndUpdate(
          podId,
          {
            $push: {
              resources: {
                resource_name,
                resource_url: signedUrl,
                uploaded_by,
                uploaded_at: new Date(),
                folder_name: folderName,
                content: fileContent,
              },
            },
          },
          { new: true }
        );

        if (!pod) {
          return res.status(404).send({ message: "Pod not found." });
        }

        res.status(200).send({
          message: "Resource added successfully!",
          pod,
        });
      } catch (error) {
        console.error("Database Update Error:", error);
        res
          .status(500)
          .send({ message: "Failed to update pod with new resource." });
      }
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error("Error during file upload:", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
});

module.exports = router;
