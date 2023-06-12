const express = require('express');
const doctorController = require('../controllers/doctorController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.post(
    '/create-profile',
  //   isAuth,
    doctorController.createProfile
  );


  router.post(
    '/create-review',
  //   isAuth,
    doctorController.review
  );
  
    module.exports = router;