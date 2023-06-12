const { createProfile } = require('../controllers/institutionController');
const institutionProfile = require('../models/institutionProfile');
const doctorProfile = require('../models/doctorProfile');
const bcrypt = require('bcryptjs');

jest.mock('../models/institutionProfile');
jest.mock('bcryptjs');

describe('createProfile', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        insurance: 'Insurance ABC',
        location: 'Location XYZ',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should create a profile and return a success message', async () => {
    const hashedPassword = 'hashedPassword';
    const instituteId = 'instituteId';
    const result = {
      _id: instituteId,
    };

    bcrypt.hash.mockResolvedValueOnce(hashedPassword);
    institutionProfile.mockReturnValueOnce({
      save: jest.fn().mockResolvedValueOnce(result),
    });

    await createProfile(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 12);
    expect(institutionProfile).toHaveBeenCalledWith({
      name: req.body.name,
      location: req.body.location,
      password: hashedPassword,
      insurance: req.body.insurance,
      email: req.body.email,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Institution created!',
      instituteId,
    });
  });

  it('should handle errors', async () => {
    const error = new Error('Internal Server Error');
    bcrypt.hash.mockRejectedValueOnce(error);

    await createProfile(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

const { addDoctor } = require('../controllers/institutionController');

jest.mock('../models/institutionProfile', () => ({
  findById: jest.fn(),
}));

jest.mock('../models/doctorProfile', () => ({
  findOne: jest.fn(),
}));

describe('addDoctor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a doctor successfully', async () => {
    // Mock request and response objects
    const req = {
      body: {
        email: 'doctor@example.com',
        instituteId: '123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the necessary functions for the test case
    const institute = {
      doctors: [],
      save: jest.fn(),
    };

    const doctor = {
      _id: 'doctorId',
      email: 'doctor@example.com',
    };

    institutionProfile.findById.mockResolvedValue(institute);
    doctorProfile.findOne.mockResolvedValue(doctor);

    await addDoctor(req, res);

    // Assertions
    expect(institutionProfile.findById).toHaveBeenCalledTimes(1);
    expect(institutionProfile.findById).toHaveBeenCalledWith('123');
    expect(doctorProfile.findOne).toHaveBeenCalledTimes(1);
    expect(doctorProfile.findOne).toHaveBeenCalledWith({ email: 'doctor@example.com' });
    expect(institute.doctors).toEqual([doctor]);
    expect(institute.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Doctor Added Successfully!' });
  });

  // Add more test cases for different scenarios if needed
});