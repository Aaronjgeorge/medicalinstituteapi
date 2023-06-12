const doctorProfile = require('../models/doctorProfile');
const institutionProfile = require('../models/institutionProfile')
const patientProfile = require('../models/patientProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email,password)
  let loadedUser; //to store the matched user in the database
  institutionProfile.findOne({ email: email })
    .then(institute => {
      if (!institute) { //if user doesnt exist
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = institute;
      return bcrypt.compare(password, institute.password); //compare hashed p[asswords]
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign( //this creates a new signature and stores it as a web token
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'abcd122432', //this is the signature
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() , email: loadedUser.email});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createProfile = async (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const insurance = req.body.insurance;
    const location=req.body.location;

    console.log(email,name,password,insurance,location)
    try {
      const hashedPw = await bcrypt.hash(password, 12);
  
      const institution = new institutionProfile({
        name:name,
        location:location,
        password: hashedPw,
        insurance: insurance,
        email: email,
        name: name
      });
      const result = await institution.save();
      res.status(201).json({ message: 'Institution created!', instituteId: result._id });
      console.log("success")
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        console.log("failed")
      }
      next(err);
    }
  };

exports.addDoctor = async (req, res, next) => {
    const doctorEmail = req.body.email;
    const instituteId = req.body.instituteId;
    try {
      const institute = await institutionProfile.findById(instituteId)
      if (!institute) {
        const error = new Error('Institute not found');
        throw error
      }
      const doctor= await doctorProfile.findOne({email:doctorEmail});
      console.log(doctor);
      if(!doctor){
        throw new Error("Doctor not found")
      }
      institute.doctors.push(doctor)
      await institute.save()
      res.status(201).json({
        message: 'Doctor Added Successfully!',
        });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };

  exports.addPatient = async (req, res, next) => {
    const patientEmail = req.body.email;
    const instituteId = req.body.instituteId;
    try {
      const institute = await institutionProfile.findById(instituteId)
      if (!institute) {
        const error = new Error('Patient not found');
        throw error
      }
      const patient= await patientProfile.findOne(patientEmail);
      if(!patient){
        throw new Error("Doctor not found")
      }
      institutionProfile.patients.push(patient)
      await institutionProfile.save()
      res.status(201).json({
        message: 'Patient Added Successfully!',
        comment: patient,
        // creator: { _id: user._id, name: user.name }
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };

  exports.getProfile = async (req, res, next) => {
    const instituteId = req.body.instituteId;
    console.log(instituteId)
    const instituteInfo = await institutionProfile.findById(instituteId)
  .populate('doctors')
  .populate('patients')
  .populate('reviews');
    console.log(instituteInfo)
    // .populate('comment')
    // .exec((err,comments)=>{
;
    try {
      if (!instituteInfo) {
        const error = new Error('Could not find institute.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'institute fetched.', instituteInfo: instituteInfo });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }; 



  exports.updateProfile = async (req, res, next) => {
    console.log("name",req.body.name,"email",req.body.email,"password",req.body.password)
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const newpassword = req.body.newpassword
      const location = req.body.location;
      const insurance =req.body.insurance
      const institutionId = req.body.institutionId;
      try {
        const hashedNPw = await bcrypt.hash(newpassword, 12);
        const institution = await institutionProfile.findById(institutionId);
        console.log(institution.password)
        if(bcrypt.compare(password,institution.password)){
          institution.password = hashedNPw;
        }else{
          throw new Error("Password does not match existing password")
        }
        institution.name =name;
        institution.email=email;
        institution.insurance=insurance;
        institution.location=location;
        await institution.save();
        console.log(institution)
        res.status(201).json({
          message: 'institution updated successfully!',
          comment: institution,
          // creator: { _id: user._id, name: user.name }
        });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    };



exports.deleteProfile = async (req, res, next) => {
          const email = req.body.email;
          const password = req.body.password;
          const institutionId = req.body.institutionId;
          
          try {
              const found = await institutionProfile.findByIdAndDelete(institutionId);
            if(found.email === email ||bcrypt.compare(password,found.password)){
            res.status(201).json({
              message: 'Institution deleted Successfully!',
              // creator: { _id: user._id, name: user.name }
            })};
          } catch (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          }
        };


