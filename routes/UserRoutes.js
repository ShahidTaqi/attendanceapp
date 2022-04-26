const { Router } = require('express');
const UserController = require('../controllers/UserController');

const router = Router();

router.post('/signup', UserController.signup_post);
router.post('/login', UserController.login_post);
//router.get('/logout', UserController.logout_get);
router.get('/users', UserController.get_users);
router.get('/users/:userId', UserController.get_user);
router.patch('/users/:userId', UserController.update_user);
router.delete('/users/:userId', UserController.delete_user);

module.exports = router;