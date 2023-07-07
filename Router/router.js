const express = require('express');
const route = express.Router()
const controller = require('../Controller/controller.js');

// const express = require('express');
// const dotenv =require('dotenv');
const app = express();
// const cors = require("cors");
// app.use(cors());

//auth
route.post('/register', controller.register);
route.post('/login-user', controller.loginUser);

//edirr
route.get('/Getedirrs', controller.Getedirrs);
route.post('/CreateEdir', controller.CreateEdir);


//creator
route.post('/Accept1', controller.Accept1);
route.post('/AcceptService', controller.AcceptService);
route.post('/checkpayment', controller.checkpayment);
route.post('/Getmemb', controller.Getmemb);

//user
route.post('/profile', controller.profile);
route.post('/Join', controller.Join);
route.post('/RequestService', controller.RequestService);
route.post('/LeaveEdirr', controller.LeaveEdirr);
route.post('/payment', controller.payment);


//admin
route.post('/checkmonthpayment', controller.checkmonthpayment);
route.get('/Getuser', controller.Getuser);

module.exports = route