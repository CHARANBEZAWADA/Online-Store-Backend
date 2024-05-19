const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
  getLoggedInUserDetails,
  changePassword,
  updateUserDetails,
  adminAllUser,
  admingetOneUser,
  adminUpdateOneUserDetails,
  adminDeleteOneUser,
  managerAllUser,
} = require('../controllers/user');

const { isLoggedIn } = require('../middleware/user');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.post('/password/reset/:token', passwordReset);
router.get('/userdashboard', isLoggedIn, getLoggedInUserDetails);
router.post('/password/update', isLoggedIn, changePassword);
router.post('/userdashboard/update', isLoggedIn, updateUserDetails);
router.get('/admin/users', isLoggedIn, adminAllUser);
router.get('/admin/user/:id', isLoggedIn, admingetOneUser);
router.put('/admin/user/:id', isLoggedIn, adminUpdateOneUserDetails);
router.delete('/admin/user/:id', isLoggedIn, adminDeleteOneUser);
router.get('/manager/users', isLoggedIn, managerAllUser);

module.exports = router;
