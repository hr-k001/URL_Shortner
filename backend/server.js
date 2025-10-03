const express = require("express");
const shortID = require("shortid");
const cors = require("cors");
const mongoose = require("mongoose");
//const path = require("path");

const PORT = 3000;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/URL-info")
  .then(() => console.log("database connected"))
  .catch((err) => {
    console.log("error connecting database");
  });

const URL_Schema = new mongoose.Schema(
  {
    ShortId: {
      type: String,
      required: true,
      unique: true,
    },

    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

const URL_DATA = mongoose.model("URL_DATA", URL_Schema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/submit", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send("URL is required");
  }

  const shortId = shortID.generate();

  await URL_DATA.create({
    ShortId: shortId,
    redirectURL: url,
    visitHistory: [],
  });

  const shortUrl = `http://localhost:${PORT}/${shortId}`;

  res.json({ shortUrl });
});

app.get("/:id", async (req, res) => {
  const shortId = req.params.id;

  const entry = await URL_DATA.findOneAndUpdate(
    { ShortId: shortId },
    {
      $push: { visitHistory: { timestamp: Date.now() } },
    },
    { new: true }
  );

  if (!entry) {
    return res.status(404).send("URL not found");
  }

  const originalURL = entry.redirectURL;

  res.redirect(302, originalURL);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
