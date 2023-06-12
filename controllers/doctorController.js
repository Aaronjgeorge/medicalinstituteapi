const doctorProfile = require('../models/doctorProfile');
const institutionProfile = require('../models/institutionProfile')
const patientProfile = require('../models/patientProfile');
const review = require('../models/review');
const bcrypt = require('bcryptjs');

exports.createProfile = async (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const speciality = req.body.speciality;
    const certifications=req.body.certifications;

    console.log(email,name,password)
    try {
      const hashedPw = await bcrypt.hash(password, 12);
  
      const doctor = new doctorProfile({
        name:name,
        email:email,
        password: hashedPw,
        speciality: speciality,
        certifications: certifications
      });
      const result = await doctor.save();
      res.status(201).json({ message: 'Doctor created!', DoctorId: result._id });
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
  const doctorId = req.body.doctorId;
  const institutionId = req.body.institutionId
  console.log(doctorId)
  try {
    const institute = await institutionProfile.findById(institutionId)
    const doctor = await doctorProfile.findById(doctorId)
    if(institute && doctor){
      const revie = new review({
        description: description,
        rating: rating,
        type: doctor,
        institution: institute
      })
      institute.reviews.push(revie)
      doctor.review.push(revie)
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