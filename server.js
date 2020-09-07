const express = require("express");
const bodyParser = require("body-parser");
const googleSheets = require("gsa-sheets");

const key = require("./privateSettings.json");

// TODO(you): Change the value of this string to the spreadsheet id for your
// GSA spreadsheet. See HW5 spec for more information.
const SPREADSHEET_ID = "1MzJ2LzV2dDCwRiEXoE1kRuW6fXuJO9W9tYynl9Dsrys";

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static("public"));

async function onGet(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;
  // parse headers
  const headers = rows[0];

  const resAsJson = [];
  // start i at 1 to skip header row
  for (let i = 1; i < rows.length; i++) {
    const entry = {};
    for (let j = 0; j < headers.length; j++) {
      entry[headers[j]] = rows[i][j];
    }
    resAsJson.push(entry);
  }

  res.json(resAsJson);
}

app.get("/api", onGet);

async function onPost(req, res) {
  const messageBody = req.body;

  // TODO(you): Implement onPost.

  res.json({ status: "unimplemented" });
}
app.post("/api", jsonParser, onPost);

async function onPatch(req, res) {
  const column = req.params.column;
  const value = req.params.value;
  const messageBody = req.body;

  // TODO(you): Implement onPatch.

  res.json({ status: "unimplemented" });
}
app.patch("/api/:column/:value", jsonParser, onPatch);

async function onDelete(req, res) {
  const column = req.params.column;
  const value = req.params.value;

  const result = await sheet.getRows();
  const rows = result.rows;
  const headers = rows[0];
  let colIndex = 0;
  let rowIndex = 0;
  for (let i = 0; i < headers.length; i++) {
    for (let j = 1; j < rows.length; j++) {
      if (headers[i] == column && rows[j][i] == value) {
        // found the column to delete
        const deleteRes = await sheet.deleteRow(j);
      }
    }
  }

  res.json({ response: "success" });
}
app.delete("/api/:column/:value", onDelete);

// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`CS193X: Server listening on port ${port}!`);
});
