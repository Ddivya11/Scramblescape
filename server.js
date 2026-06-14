const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
// Serve static files (HTML, CSS, JS) from public and views
// Disable aggressive caching during development so style changes appear immediately
app.use(express.static(path.join(__dirname, "public"), { etag: false, maxAge: 0 }));
app.use(express.static(path.join(__dirname, "views"), { etag: false, maxAge: 0 }));

// Word banks
const level1Words = ["cats", "star", "dust", "lamp", "frog"];
const level2Words = ["listen", "silent", "garden", "prince", "finger"];
const level3Words = ["triangle", "stranger", "climbing", "response", "generate"];

// Helpers
function getRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

app.get("/word/:level", (req, res) => {
  const level = parseInt(req.params.level);

  let word;

  if (level === 0) {
    word = getRandom(level1Words);
  } else if (level === 1) {
    word = getRandom(level2Words);
  } else {
    word = getRandom(level3Words);
  }

  res.json({ word });
});

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



// CHECK ANSWER
app.post("/check", (req, res) => {
  const answer = req.body.answer.toLowerCase();
  const correctWord = req.body.correctWord.toLowerCase();
  const level = parseInt(req.body.level);

  if (answer !== correctWord) {
    return res.json({
      success: false,
      message: "❌ Wrong Answer"
    });
  }

  if (level < 2) {
    return res.json({
      success: true,
      message: "🎉 Correct!",
      nextLevel: level + 1
    });
  }

  return res.json({
    success: true,
    message: "🏆 You completed Scramble Scape!",
    nextLevel: -1
  });
});
// START SERVER
app.listen(PORT, () => {
  console.log(`Scramble Scape running at http://localhost:${PORT}`);
});