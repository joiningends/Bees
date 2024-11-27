const express = require('express');
const router = express.Router();
const userController = require('../Controllers/usercontroller');


router.post('/login', userController.loginUser);
//router.post('/refresh-token', userController.refreshToken);
router.post('/', userController.createUser);
router.get('/email/:email', userController.getUserByEmail);


router.get('/:id', userController.getUserById);


router.put('/:id', userController.updateUser);

router.get('/check-email/:email', userController.emailexsit);
router.get('/dash/bord', userController.getDashboardCounts);
router.get('/dash/bord/customer/:id', userController.getDashboardCountsByCustomerId);
router.get('/dash/bord/employee/:id', userController.getDashboardCountsByEmployeeId);
module.exports = router;