import express from "express";
import multer from "multer";
import cors from "cors";
import Replicate from "replicate";
import fs from "fs";

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() }); // image en mémoire

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

app.get("/", (req, res) => res.send("Serveur IA XMax actif"));

app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const base64Image = buffer.toString("base64");

    const output = await replicate.run(
      "prunaai/z-image-turbo",
      {
        input: {
          image: `data:${req.file.mimetype};base64,${base64Image}`,
          prompt: "home staging, modern interior, bright, realistic",
          height: 768
        }
      }
    );

    res.json({
      avant: `data:${req.file.mimetype};base64,${base64Image}`,
      apres: output.url
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur IA", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Serveur IA XMax lancé sur le port " + PORT));
