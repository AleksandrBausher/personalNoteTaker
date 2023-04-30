const express = require("express");
const fs = require("fs")

const db = require("./db/db.json");

const path = require("path");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  res.json(db);
});

app.post("/api/notes", (req, res) => {
  db.push(req.body);
  fs.writeFile(
    path.join(__dirname, "db/db.json"),
    JSON.stringify(db),
    (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Successfully added to the file");
      }
    }
  );

  let response;

  if (req.body && req.body.product) {
    response = {
      status: "success",
      data: req.body,
    };
    res.status(201).json(response);
  } else {
    res.status(400).json("Request body must at least contain some data");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  db.forEach((element) => {
    if (element.id === req.params.id) {
      db.pop(element);
    }
  });
  fs.writeFile(
    path.join(__dirname, "db/db.json"),
    JSON.stringify(db),
    (erroe) => {
      if (erroe) console.log(erroe);
      else console.log("Successful");
    }
  );

  var response;

  if (req.body && req.body.product) {
    response = {
      status: "Successfull",
      data: req.body,
    };
    res.status(201).json(response);
  } else {
    res.status(400).json("No data in the body");
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);