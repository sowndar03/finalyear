  const { WebSocketServer } = require("ws");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

db.connect((Err) => {
  if (Err) {
    console.error("Error connecting to the database");
  } else {
    console.log("Connected to the database!");
  }
});

const reg_no = [
  "TN 51 S 6529",
  "TN 31 S 1843",
  "TN 32 A 1943",
  "TN 41 B 4243",
  "TN 35 C 3243",
  "TN 61 D 4243",
  "TN 71 E 5243",
  "TN 38 F 6243",
  "TN 32 G 7243",
  "TN 30 H 8243",
  "TN 99 I 9243",
  "TN 78 J 1235",
];

const driverName = [
  "Sowndar",
  "Vignesh",
  "Vishal",
  "Gokulnath",
  "Santhosh",
  "Gopalakannan",
  "Sanjay",
  "Lokesh",
  "Yuvaraaj",
  "Sudharshan",
  "Kavin",
  "Tamil selvam",
];

const imageURL = [
  "https://media.istockphoto.com/id/1395748040/photo/a-young-boy-getting-onto-a-school-bus-in-sunshine.jpg?s=2048x2048&w=is&k=20&c=tFn5FqAL6hxMkA6wdJqaiHqurcp4ZwEosog73Ui13Rc=",
  "https://media.istockphoto.com/id/1854520497/photo/front-shot-of-parked-retro-yellow-school-bus-standing-on-the-road.jpg?s=1024x1024&w=is&k=20&c=sivyL9doMz_zxfwSVj7oqok-NJ5TLGmZ2x_x5e1uwJU=",
];

const wss = new WebSocketServer({ port: 8765 });

let clients = {};

let expected = {
  "Speed limit (30km/h)": { speed: 30 },
  Stop: { speed: 0 },
  "No entry": { straight: false },
  "Bumpy road": { speed: 20 },
  Pedestrians: { speed: 20 },
  "Turn right ahead": { left: false },
  "Turn left ahead": { right: false },
  "Ahead only": { straight: true },
  "Road work": { speed: 20 },
};

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  let i = 0;

  ws.on("message", function message(data) {
    parsedData = JSON.parse(data);
    var nameValue = parsedData.name;
    var message = parsedData.message;
    clients[nameValue] = message;

    if (nameValue === "Model") {
      switch (clients.Model.result) {
        case "Speed limit (30km/h)":
          if (clients.Vehicle.speed > expected[clients.Model.result].speed) {
            i = i + 1;
          }
          break;
        case "Stop":
          if (clients.Vehicle.speed !== expected[clients.Model.result].speed) {
            i = i + 1;
          }
          break;
        case "No entry":
          if (
            clients.Vehicle.straight !== expected[clients.Model.result].straight
          ) {
            i = i + 1;
          }
          break;
        case "Bumpy road":
          if (clients.Vehicle.speed > expected[clients.Model.result].speed) {
            i = i + 1;
          }
          break;
        case "Pedestrians":
          if (clients.Vehicle.speed > expected[clients.Model.result.speed]) {
            i = i + 1;
          }
          break;
        case "Road work":
          if (clients.Vehicle.speed > expected[clients.Model.result].speed) {
            i = i + 1;
          }
          break;
        case "Turn right ahead":
          if (clients.Vehicle.left === expected[clients.Model.result].left) {
            i = i + 1;
          }
          break;
        case "Turn left ahead":
          if (clients.Vehicle.right === expected[clients.Model.result].right) {
            i = i + 1;
          }
          break;
        case "Ahead only":
          if (
            clients.Vehicle.straight === expected[clients.Model.result].straight
          ) {
            i = i + 1;
          }
          break;
      }
      if (i > 90) {
        const msg = `Traffic signal ${parsedData.message.result} violated!!!`;
        console.log(msg);
        const currentTime = new Date();

        const hours = currentTime.getHours().toString().padStart(2, "0");
        const minutes = currentTime.getMinutes().toString().padStart(2, "0");
        const seconds = currentTime.getSeconds().toString().padStart(2, "0");

        const formattedTime = `${hours}:${minutes}:${seconds}`;
        const sqlInsert =
          "INSERT INTO fleet (Time, message, Reg_no, Owner_name, Driver_name, model, Image) VALUES (?, ?,?,?,?,?,?)";
        const randomReg_no = reg_no[Math.floor(Math.random() * 12)];
        const randomDriver_name = driverName[Math.floor(Math.random() * 12)];
        const randomImage = imageURL[Math.floor(Math.random() * 2)];
        const model_year =
          Math.floor(Math.random() * (2021 - 1980 + 1)) + 1980;
        db.query(
          sqlInsert,
          [
            formattedTime,
            msg,
            randomReg_no,
            "Anna university",
            randomDriver_name,
            model_year,
            randomImage,
          ],
          (err, result) => {
            if (err) {
              console.error("Error while inserting into the database");
            } else {
              console.log("Data inserted successfully!");
            }
          }
        );
        i = 0;
      }
    }

    delete clients["Model"];
    ws.send("OK");
  });

  // Send violation data to the client upon request
  ws.on("message", function requestViolationData() {
    const sqlSelect = "SELECT * FROM fleet";
    db.query(sqlSelect, (err, results) => {
      if (err) {
        console.error(
          "Error while fetching violation data from the database:",
          err
        );
      } else {
        ws.send(JSON.stringify(results));
      }
    });
  });
});

module.exports = wss;
