const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const dotenv = require("dotenv");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
dotenv.config();

app.get("/", async (req, res) => {
  const shortUrlsAll = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrlsAll });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(3000, () => {
  mongoose
    .connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
      console.log("connected to mongodb");
      console.log("Running on port 3000");
    })
    .catch((e) => {
      console.error(`An error connecting to database: ${e}`);
    });
});
