const express = require('express');
const institutionController = require('../controllers/institutionController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// router.get(
//     '/get-products',
//     // isAuth,
//     adminController.getProducts
//   );
  
//   router.get(
//     '/get-product/:productId',
//     // isAuth,
//     adminController.getProduct
//   );
  
//   router.get(
//     '/getProfile/:userId',
//     isAuth,
//     adminController.getProfile
//   );
  
router.post('/login', institutionController.login);
  router.post(
      '/create-profile',
      isAuth,
      institutionController.createProfile
    );
  
    router.post(
      '/add-doctor'
      ,isAuth
      ,institutionController.addDoctor
    );

    router.post(
      '/update-profile'
      ,isAuth
      ,institutionController.updateProfile
    );

    
    router.post(
      '/delete-profile'
      ,isAuth
      ,institutionController.deleteProfile
    );

    router.get(
      '/get-profile',
      isAuth,
      institutionController.getProfile
    );
  
  
    // router.post("/add-cart",isAuth,adminController.addItemToCart);
    // router.get("/cart/:userId",isAuth, adminController.getCart);
    // router.delete("/empty-cart",isAuth, adminController.emptyCart);
    // router.post("/place-order",isAuth, adminController.placeOrder);
  
  
  
    module.exports = router;