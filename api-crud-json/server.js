const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require('body-parser')
const fs = require('fs');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static("public"));

// array of stats
const statsPath = __dirname + '/stats.json';
const getData = () => {
  const dataJSON = fs.readFileSync(statsPath).toString('utf8'),
        data = JSON.parse(dataJSON);
  return data;
};
const writeData = (newData) => fs.writeFileSync(statsPath, JSON.stringify(newData));

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