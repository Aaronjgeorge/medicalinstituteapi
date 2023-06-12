const express = require("express");
const mongoose = require('mongoose');
const app = express();
const institutionRoutes = require('./routes/institution');
const doctorRoutes = require('./routes/doctor');
const patientRoutes = require('./routes/patient');



app.use(express.urlencoded({extended: true}));
app.use(express.json())



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); //this authorization header is  required for json web tokens
    next();
  });

  app.use('/institution', institutionRoutes);
  app.use('/doctor', doctorRoutes);

  mongoose
    .connect(
      'mongodb+srv://Aaronjgeorge:d5dq4iZxipRLCj1Z@cluster0.dlmness.mongodb.net/'
    )
    .then(result => {
      app.listen(8080);
    })
    .catch(err => console.log(err));