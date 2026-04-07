import express from "express";
import fs from "fs";
import path from "path";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Ili obican tekst ako nema HTML datoteke.");
});

app.get("/slike", (req, res) => {
  const folderPath = path.join(process.cwd(), "public", "images");

  const files = fs.readdirSync(folderPath);

  const images = files
    .filter(file => file.endsWith(".webp"))
    .map((file, index) => ({
      url: `/images/${file}`,
      title: `Slika ${index + 1}`,
      id: `lb${index + 1}`
    }));

  res.render("slike", { images });
});

app.listen(3000, () => {
  console.log("Server is up and running");
});
