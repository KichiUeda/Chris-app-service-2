/* eslint-disable no-console */
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const Overview = require('../database_mongo/index.js');
// const data = require('../database_mongo/seed.js');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/system_req/:product_id', (req, res) => {
  const id = req.params.product_id;
  Overview.find({ product_id: id }).then((doc) => {
    axios
      .get(`http://ec2-54-224-38-115.compute-1.amazonaws.com:5150/genre/${id}`)
      .then((response) => {
        const resArray = doc;
        const newGenre = response.data;

        resArray.push(newGenre);
        return resArray;
      })
      .then((resArray) => {
        res.set({ 'Access-Control-Allow-Origin': '*' });
        res.send(resArray);
      })
      .catch((error) => {
        throw error;
      });
  });
});

app.get('/system_req/platforms/:product_id', (req, res) => {
  const id = req.params.product_id;

  Overview.find({ product_id: id }, (err, doc) => {
    if (err) {
      throw err;
    }
    console.log('Platforms', doc[0]);
    const osPlatformsObj = {
      product_id: id,
      platforms: doc[0].platforms,
      os: doc[0].os
    };
    res.set({ 'Access-Control-Allow-Origin': '*' });
    res.json(osPlatformsObj);
  });
});

module.exports = app;
