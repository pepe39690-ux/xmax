import express from "express";
import multer from "multer";
import cors from "cors";
import Replicate from "replicate";
import path from "path";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

app.get("/", (req, res) => {
  res.send("Serveur IA XMax actif");
});

app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const imageUrl = `${process.env.PUBLIC_URL}/uploads/${req.file.filename}`;

    const output = await replicate.run(
      "prunaai/z-image-turbo",
      {
        input: {
          image: imageUrl,
          prompt: "home staging, modern interior, bright, realistic",
          height: 768
        }
      }
    );

    res.json({
      avant: imageUrl,
      apres: output.url
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur IA" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Serveur IA XMax lancé sur le port " + PORT));
