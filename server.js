const express = require('express');
const dotenv =require('dotenv');
const app = express();
const bodyparser = require('body-parser');
const route = require("./Router/router");

const cors = require("cors");
app.use(cors());
app.use(bodyparser.urlencoded({ extended : true}))

const connectDB = require('./database/connection');
const schedule = require('node-schedule');
const { runOnceADay,test } = require('./Controller/controller');
  //  test();

  schedule.scheduleJob('0 9 * * *', runOnceADay);
// test();
// schedule.scheduleJob('0 0 * * *', runOnceADay());
dotenv.config({ path: ".env" });
const PORT = process.env.PORT||8080
connectDB();
app.use(express.json())
app.get('/',(req,res)=>{
res.render('index');
})


app.use('/', route);
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
});
