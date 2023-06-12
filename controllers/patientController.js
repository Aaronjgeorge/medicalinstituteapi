const doctorProfile = require('../models/doctorProfile');
const institutionProfile = require('../models/institutionProfile')
const patientProfile = require('../models/patientProfile');
const review = require('../models/review');
const bcrypt = require('bcryptjs');

exports.createProfile = async (req, res, next) => {

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const ethnicity = req.body.ethnicity;
    const allergies=req.body.allergies;

    console.log(email,name,password)
    try {
      const hashedPw = await bcrypt.hash(password, 12);
  
      const patient = new patientProfile({
        name:name,
        email:email,
        password: hashedPw,
        allergies: allergies,
        age: age,
        ethnicity: ethnicity
      });
      const result = await patient.save();
      res.status(201).json({ message: 'Patient created!', PatientId: result._id });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };

  exports.review = async(req,res,next)=>{
    const description = req.body.description;
    const rating = req.body.rating;
    const patientId = req.body.patientId;
    const institutionId = req.body.institutionId
    console.log(patientId)
    try {
      const institute = await institutionProfile.findById(institutionId)
      const patient = await doctorProfile.findById(patientId)
      if(institute && patient){
        const revie = new review({
          description: description,
          rating: rating,
          type: patient,
          institution: institute
        })
        institute.reviews.push(revie)
        patient.review.push(revie)
        await revie.save();
        await institute.save();
      }else{
        throw new Error ("Cannot leave review")
      }
      res.status(201).json({ message: 'Institution created!'});
        console.log("success")
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
          console.log("failed")
        }
        next(err);
      }
    };