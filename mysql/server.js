const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static("public"));
const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "team"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  /*
  // new DB
  db.query('CREATE DATABASE team', (err) => {
    if (err) throw err;
    console.log('DB created');
  });
  // new Table
  const sql = 'CREATE TABLE players(id int AUTO_INCREMENT, number VARCHAR(255), name VARCHAR(255), points VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err) => {
    if (err) throw err;
    console.log('TABLE CREATED');
  });
  // new Record
  const post = {"number":123,"name":"Jane","points":19};
  const sql = 'INSERT INTO players SET ?';
  db.query(sql, post, (err) => {
    if (err) throw err;
    console.log('player added');
  });
  */
});


// array of stats
const getData = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM players', (err, resp) => {
      if (err) reject(err);
      resolve(resp);
    });
  });  
};

const addData = (newPlayer) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO players SET ?', newPlayer, (err, resp) => {
      if (err) reject(err);
      resolve(resp);
    });
  });  
};

const editData = ({ number, name, points }) => {
  return new Promise((resolve, reject) => {
    const newData = `${name ? `name = "${name}"` : ''} ${name && points ? ', ' : ''} ${points ? `points = "${points}"` : ''}`;
    console.log('newData', newData);
    db.query(`UPDATE players SET ${newData} WHERE number = ${number}`, (err, resp) => {
      if (err) reject(err);
      resolve(resp);
    });
  });  
};

const deleteData = (number) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM players WHERE number = ${number}`, (err, resp) => {
      if (err) reject(err);
      resolve(resp);
    });
  }); 
};

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
  .get((req, res) => {
    getData().then((data) => {
      console.log('data fetched from db', data);
      res.json(data);
    });
  })
  .post((req, res) => {
    console.log('POST');
    const newPlayer = {
      number: req.body.number,
      name: req.body.name,
      points: req.body.points
    };
    addData(newPlayer).then((data) => {
      console.log('data added to db', data);
      getData().then((data) => {
        console.log('data fetched from db', data);
        res.json(data);
      });
    });
  });

// UPDATE (EDIT) & DELETE
app.route("/api/v1/stats/:id")
  .put((req, res) => {
    console.log('EDIT or DELETE');
    const thisStat = {},
          pNumber = Number(req.params.id),
          newName = req.body.name,
          newPoints = req.body.points;
    if (!pNumber) return console.log('no player number found');
    thisStat.number = pNumber;
    if (newName) thisStat.name = newName;
    if (newPoints) thisStat.points = newPoints;
    console.log('thisStat', thisStat);
    editData(thisStat).then((data) => {
      console.log('data edited in db', data);
      getData().then((data) => {
        console.log('data fetched from db', data);
        res.json(data);
      });
    }).catch((err) => console.log('Err', err));
  })
  .delete((req, res) => {
    console.log('DELETE');   
    const pNumber = req.params.id;
    if (!pNumber) return console.log('no player number found');
    deleteData(pNumber).then((data) => {
      console.log('data deleted in db', data);
      getData().then((data) => {
        console.log('data fetched from db', data);
        res.json(data);
      });
    }).catch((err) => console.log('Err', err));
  });

// listen
const port = '3000';
// const port = process.env.PORT;
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});