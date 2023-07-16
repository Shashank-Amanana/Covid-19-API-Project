const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
const data1 = require("./changedJson.json"); // assign json to var
const data2 = require("./csvjson2.json");
// app.use(express.bodyParser());
// var details = require('./csvjson (1).json')
const port = 3000;
app.get("/", (req, res) => {
  // get method
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.post("/district", (req, res) => {
  let state = req.body.state; // state vale from user

  district = []; // district names = [a,b,c]
  vaccinated = []; // vaccinated details for each district in district array = [vaccinated in a, vaccinated in b, vaccinated in c]

  for (let i = 0; i < data1.length; i++) {
    // iterating over the json file
    if (data1[i].State == state) {
      //entry's state is equal to user entered state
      if (district.length < 10) {
        // if district count is less than 10, append the district
        district.push(data1[i].District);
        vaccinated.push(data1[i].Vaccinated);
      } else {
        // sorting the districts and getting the top 10
        let min = vaccinated[0],
          index = 0;
        for (let j = 1; j < 10; j++) {
          if (vaccinated[j] < min) {
            min = vaccinated[j];
            index = j;
          }
        }
        if (min < data1[i].Vaccinated) {
          vaccinated.splice(index + 1, 1);
          district.splice(index + 1, 1);
          vaccinated.push(data1[i].Vaccinated);
          district.push(data1[i].District);
        }
      }
    }
  }
  console.log(vaccinated, district); // printing

  // obj1 stores {district: vaccinatedCount}
  const obj1 = {};
  district.forEach((element, index) => {
    obj1[element] = vaccinated[index];
  });
  arr1 = [];
  arr1.push(obj1);
  res.send(arr1);
});

app.post("/infectionAndRecovery", (req, res) => {
  let state = req.body.state; // state vale from user

  let month = req.body.month; // month from user
  // console.log(month);
  let infection = 0;
  let recovered = 0;

  for (let i = 0; i < data2.length; i++) {
    //second json file
    if (
      data2[i].State == state && // state is equal to user entered state
      data2[i].Date.substring(5, 7) == month && //
      data2[i].Date.substring(0, 4) == "2020"
    ) {
      if (data2[i].TotalSamples != "" && data2[i].Positive != "") {
        // neglect json entries where Positive ot TotalSamples is null

        //increment
        infection = infection + data2[i].TotalSamples;
        recovered = recovered + data2[i].Positive;

        //testing if any null values present
        // console.log(
        //   "Positive: " + data2[i].Positive + " Total:  " + data2[i].TotalSamples
        // );
      }
    }
  }

  // reponse
  const obj2 = {}; // dict or json

  // response = >
  // [{
  //   "key1", "value1"
  // },
  // {
  //   "key": value
  // }]

  obj2["infections"] = infection;
  obj2["recovered"] = recovered;
  arr1 = [];
  arr1.push(obj2);
  res.send(arr1);
});

app.listen(port, () => console.log(` App listening on port ${port}!`));

// [obj1, obj2]
