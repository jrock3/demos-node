const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static("public"));

let stats = [
  {"id":145,"name":"Ross","points_scored":"14"},
  {"id":101,"name":"Joe","points_scored":"12"}
];
const getData = () => stats;
const writeData = (newData) => stats = newData;

// MIDDLEWARE
app.all('/', function (req, res, next) {
  console.log('Accessing ...');
  next(); // pass control to the next handler
})

// STARTING PAGE
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// GET (VIEW) && POST (ADD) 
app.route("/api/v1/stats/")
  .get((request, response) => {
    const data = getData();
    response.json(data);
  })
  .post((req, res) => {
    const stats = getData();
    const newStat = {
      id: Number(req.body.id),
      name: req.body.name,
      points_scored: req.body.points_scored
    };
    stats.push(newStat);
    writeData(stats);
    res.json(stats);
  });

// UPDATE (EDIT) & DELETE
app.route("/api/v1/stats/:id")
  .put((req, res) => {
    const stats = getData();
    const thisPlayer = stats.find(player => player.id === Number(req.params.id)),
          thisIndex = stats.indexOf(thisPlayer);
    if (thisIndex === -1) return;

    const thisStat = stats[thisIndex],
          newId = req.body.id,
          newName = req.body.name,
          newPoints = req.body.points_scored;
    if (newId) thisStat.id = Number(newId);
    if (newName) thisStat.name = newName;
    if (newPoints) thisStat.points_scored = newPoints;
    writeData(stats);
    res.json(stats);
  })
  .delete((req, res) => {
    const stats = getData();
    const thisPlayer = stats.find(player => player.id === Number(req.params.id)),
          thisIndex = stats.indexOf(thisPlayer);
    if (thisIndex === -1) return;
    stats.splice(thisIndex, 1);
    writeData(stats);
    res.json(stats);
  });

// listen
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});