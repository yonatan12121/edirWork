const express = require('express');
const route = express.Router()
const controller = require('../Controller/controller.js');

// const express = require('express');
// const dotenv =require('dotenv');
const app = express();
// const cors = require("cors");
// app.use(cors());


route.get('/Getedirr', controller.Getedirr);
route.get('/Getuser', controller.Getuser);
route.post('/register', controller.register);
route.post('/CreateEdir', controller.CreateEdir);
route.post('/Getmemb', controller.Getmemb);
route.get('/Getedirrs', controller.Getedirrs);
route.post('/profile', controller.profile);
route.post('/checkmonthpayment', controller.checkmonthpayment);
route.post('/Join', controller.Join);
route.post('/Accept1', controller.Accept1);
route.post('/RequestService', controller.RequestService);
route.post('/AcceptService', controller.AcceptService);
route.post('/checkpayment', controller.checkpayment);
route.post('/login-user', controller.loginUser);
route.post('/LeaveEdirr', controller.LeaveEdirr);


module.exports = route