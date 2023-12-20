import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: process.env.DB_PW,
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items;

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  // console.log(item);
  db.query("INSERT INTO items (title) VALUES ($1);", [item]);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const updatedItem = req.body.updatedItemTitle;
  const updatedId = req.body.updatedItemId;
  // console.log(updatedItem);
  // console.log(updatedId);
  db.query("UPDATE items SET title = $1 WHERE id = $2", [
    updatedItem,
    updatedId,
  ]);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  // Do Something
  const toDeleteId = req.body.deleteItemId;
  // console.log(toDeleteId);
  db.query("DELETE FROM items WHERE id = $1", [toDeleteId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
