const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');
const MessagesController = require('../controllers/messages.controller');
const passport = require('passport');
const path = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ status: "success", message: "Parcel Pending API", data: { "version_number": "v1.0.0" } })
});


router.post('/users/login', UserController.login);

router.post('/users/signup', UserController.create);

router.get('/getUsers',
  passport.authenticate('jwt', { session: false }),
  UserController.getUsers);

//messages controller
router.get('/getMessages',
  passport.authenticate('jwt', { session: false }),
  MessagesController.getMessages);

router.post('/sendMessage',
  passport.authenticate('jwt', { session: false }),
  MessagesController.sendMessage);

router.put('/markMessageSeen',
  //passport.authenticate('jwt', { session: false }),
  MessagesController.markMessageSeen);


//********* API DOCUMENTATION **********
router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
