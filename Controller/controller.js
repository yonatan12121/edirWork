const express = require('express');
const app = express();
app.use(express.json());
const chapa = require('chapa-nodejs');
const bcrypt = require("bcryptjs");
const cors = require("cors");
app.use(cors());
var User = require('../Model/UserModel');
var Admin = require('../Model/AdminModel');
var Edirs = require('../model/model');
const jwt = require("jsonwebtoken");
const { Job } = require('node-schedule');

const JWT_SECRET = "nhjndshnbhsiduy78q3ye3yhrewhriewopfew[fpe-fpe-pf[df[s;f[ds;f[ds;f[ds;f[ds;,fld,s.mdnshbgvcarfdtwygyqgygdhsabjbcnvgawqrr6t8siahjdvdgvds()!@#$%^&*";

exports.runOnceADay=async() => {
 
  var i;
  const PaymentDay="11"
  // Your code here
  const now = new Date();
  const aa = String(now);
  var bb = aa.split(" ", 4);
  const curentpayment = bb[2];
  console.log(curentpayment);
  const Edir= await Edirs.find({CurrentPaymentDay:curentpayment});
  // const users= await User.find();
  // console.log(users);
  // console.log(Edir[0].Members[0].Email)
  var Store = []
  Edir.forEach((eDir)=>{
    eDir.Members.forEach((members)=>{
      Store = Store.concat( members.Email)
    })
  })
  // console.log(Store);

  Store.forEach(async (eDir) =>{
    const paymentNotification =await Edirs.find({"Members.Email": eDir,"Members.Payment": "Not Payed",CurrentPaymentDay:curentpayment});
    // console.log(paymentNotification);
    paymentNotification.forEach((PN)=>{
      console.log(PN.NameOfeDirr,now,PN.Amount)
      User.updateOne({email:eDir},{$push:{Notification:[{text:"Your monthly payment is due ",edirr:PN.NameOfeDirr,type:"mPayment",Date:now,Payment:PN.Amount}]}},(err,doc)=>{
        if (err) return console.log(err);
        console.log("NOtified");
        var next;
        paymentNotification.forEach((PN)=>{
          console.log(PN.PaymentDuration)
          
          if(PN.PaymentDuration==30){
            var newpayment =(parseInt(PN.CurrentPaymentDay) + 30)
            
            console.log(newpayment);
            if (newpayment>30){
             next = newpayment-30
              console.log(next)
               
            }
            else{
              next=newpayment;
            }
          }
          else if(PN.PaymentDuration==7){
            console.log("we in 7");
            var newpayment =(parseInt(PN.CurrentPaymentDay) + 7)
    
            console.log(newpayment);
            if (newpayment>30){
              next = newpayment-30
              console.log(next)
               
            }
            else{
              next=newpayment;
            }
          }else if(PN.PaymentDuration==14){
            var newpayment =(parseInt(PN.CurrentPaymentDay) + 14)
    
            console.log(newpayment);
            if (newpayment>30){
               next = newpayment-30
              console.log(next)
               
            }
            else{
              next=newpayment;
            }
          }else if(PN.PaymentDuration==21){
            var newpayment =(parseInt(PN.CurrentPaymentDay) + 21)
    
            console.log(newpayment);
            if (newpayment>30){
               next = newpayment-30
              console.log(next)
               
            }
            else{
              next=newpayment;
            }
          }
          console.log(next);
             Edirs.updateOne( { NameOfeDirr: PN.NameOfeDirr },{ $set: { CurrentPaymentDay: next }},(err,doc)=>{
              if (err) return console.log(err);
              console.log("current payemnt updated ");
            });
         
        })
      
      });
    })
  })
// 
}
exports.register = async (req, res) => {
  const { userName, fullName, phoneNumber, email, password } = req.body;
  const role = "user";
  // const Creator =email;

  const encreptedPassword = await bcrypt.hash(password, 10);

  console.log("hello");

  try {
    await User.create({
      userName,
      fullName,
      phoneNumber,
      email,
      password: encreptedPassword,
      role,
    });
  
    console.log("success");
  
    res.send({ status: "ok" });
  } catch (error) {
    if (error.code === 11000 || error.code === 16460) {
      // Duplicate key error or unique key constraint violation
      res.send({ status: "error", error: "Duplicate data" });
      console.log("Duplicate data");
    } else if (error.code === 17140) {
      // Missing expected field error
      res.send({ status: "error", error: "Missing expected field" });
      console.log("Missing expected field");
    } else if (error.code === 20250) {
      // Invalid document or field name error
      res.send({ status: "error", error: "Invalid document or field name" });
      console.log("Invalid document or field name");
    } else if (error.code === 21328) {
      // Maximum index key length exceeded error
      res.send({ status: "error", error: "Maximum index key length exceeded" });
      console.log("Maximum index key length exceeded");
    } else {
      // Generic error handling
      res.send({ status: "error", error: error.message });
      console.log(error.message);
    }
  }
  
  
}
exports.loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log("emaillll", 0);
    const user = await User.findOne({ userName });

    if (!user) {
      return res.json({ error: "User Not found" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.userName }, JWT_SECRET, {
        expiresIn: "15m",
      });
      const role = user.role;
      const fullName = user.fullName;
      const userName = user.userName;
      const email = user.email;

      if (res.status(201)) {
        if (role === "user" || role === "creator") {
          return res.json({
            status: "ok",
            userName,
            role,
            email,
            fullName,
            data: token,
          });
        } else if (role === "admin") {
          return res.json({ status: "ok", role, data: token });
        }
      } else {
        throw new Error("Response status is not 201");
      }
    } else {
      throw new Error("Invalid Password");
    }
  } catch (error) {
    console.error(error);
    return res.json({ status: "error", error: error.message });
  }
};
exports.CreateEdir = async (req, res) => {
  const {
    NameOfeDirr,
    eDirrType,
    Amount,
    PaymentDuration,
    PaymentDay,
    Description,
    Creator,
  } = req.body;

  try {
    await Edirs.create({
      NameOfeDirr,
      eDirrType,
      Amount,
      PaymentDuration,
      PaymentDay,
      Description,
      Creator,
    });

    Admin.updateOne(
      { _id: "641b09fbc5dd296cf1c700a7" },
      {
        $push: {
          Notification: [
            {
              text: Creator + " has created " + NameOfeDirr,
              Creator: Creator,
              edirr: NameOfeDirr,
            },
          ],
        },
      },
      (err, doc) => {
        if (err) {
          console.error(err);
          return res.json({ status: "error", error: err.message });
        }
        console.log("Notified");
      }
    );

    console.log("eDirr created successfully");
    return res.json({ status: "ok" });

  } catch (error) {
    console.error(error);
    return res.json({ status: "error", error: error.message });
  }
};
exports.Join = async (req, res) => {
  const { userName, NameOfeDirr, Creator } = req.body;
  console.log(userName, NameOfeDirr, Creator);

  try {
    const updateEdirs = await Edirs.updateOne(
      { NameOfeDirr: NameOfeDirr },
      { $addToSet: { Member: { userName: userName } } }
    ).exec();

    if (updateEdirs.n === 0) {
      throw new Error("NameOfeDirr not found");
    }

    const updateUser = await User.updateOne(
      { email: Creator },
      { $push: { Notification: [{ text: userName + " wants to join your edirr", name: userName, edirr: NameOfeDirr }] } }
    ).exec();

    if (!updateUser) {
      throw new Error("Failed to update User");
    }

    console.log("Notified");
    res.json(updateEdirs);

  } catch (error) {
    console.error(error);
    res.json({ status: "error", error: error.message });
  }
};
exports.Accept1 = async (req, res) => {
  const { userName, edirr, Creator } = req.body;
  console.log("acccept111");
  console.log(Creator);
   const paymentNotification =await Edirs.find({"Members.userName": userName});
  
  Edirs.updateOne({ NameOfeDirr: edirr }, { $push: { Members: { userName: userName, Payment: "Not Payed" } } }, (err, doc) => {
    if (err) return console.log(err);
          paymentNotification.forEach((PN)=>{   
        console.log("payment notification",PN.NameOfeDirr,PN.Amount);
    User.updateOne({ userName: userName }, { $push: { Notification: [{ text: "you have joined please pay your inital payemnt to procced " , edirr:PN.NameOfeDirr,type:"iPayment",Payment:PN.Amount }] } }, (err, doc) => {
      if (err) return console.log(err);
      console.log("NOtified")
    
      User.updateOne(
        { userName: Creator },
        { $pull: { Notification: { name: userName } } }, (err, doc) => {
          if (err) return console.log(err);
          console.log("removed the notification")
        })
    });
  })
    res.json(doc)
  });
}
exports.LeaveEdirr = async (req, res) => {
  const { id, userName } = req.body;
  console.log(id);
  console.log(userName);

  try {
    const updatedEdirs = await Edirs.findOneAndUpdate(
      { _id: id },
      { $pull: { Member: { userName: userName } } },
      { new: true }
    ).exec();

    if (!updatedEdirs) {
      throw new Error("Member not found in Edirr");
    }

    console.log("Member removed from Edirr");
    res.status(200).send({ status: "ok" });

  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error: error.message });
  }
};
exports.Getedirr = (req, res) => {
  Edirs.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    else {

      console.log(data)
      res.status(200).send(data);

    }
  }).sort({createdAt: -1})

}
exports.Getuser = async (req, res) => {
  User.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      console.log(data.length);
      res.status(200).send(data);


    }
  })

}
exports.Getmemb = async (req, res) => {
  const { edirrName } = req.body;
  console.log(edirrName);

  try {
    const data = await Edirs.findOne({ NameOfeDirr: edirrName }, 'Member').exec();

    if (!data) {
      throw new Error("Edirr not found");
    }

    res.status(200).send(data);

  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error: error.message });
  }
};
exports.Getedirrs = async (req, res) => {
  try {
    const eDirr = await Edirs.findOne({});

    if (!eDirr) {
      throw new Error("No eDirr found");
    }

    return res.json({
      status: "ok",
      eDirr
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "error",
      error: error.message
    });
  }
};
exports.profile = async (req, res) => {
  const { userName } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (user) {
      res.json({ status: "ok", user });
      console.log(user);
    } else {
      res.json({ status: "error", message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.json({ status: "error", error: err.message });
  }
};


exports.checkmonthpayment = async (req, res) => {
  const { email, edirrName, toDay } = req.body;
  console.log("the name is  " + edirrName);
  // const user = await Edirs.findOne({ edirrName });
  console.log(toDay);
  // const cursor = db.collection('inventory').find({
  //   instock: { $elemMatch: { qty: 5, warehouse: 'A' } }
  // });

  // const u = JSON.parse(user.Members);
  // console.log(u);
  const users = await Edirs.findOne({ "NameOfeDirr": edirrName, "MonthlyPayment.Email": email, "MonthlyPayment.Date": toDay });
  // const users = await Edirs.find({MonthlyPayment:{Email:email}});
  // console.log(users);
  var check;
  console.log(users);
  if (!users && users === null) {
    check = "Not Payed";
  } else {
    check = "Payed";
  }
  console.log(check);
  return res.json({ check });

}

exports.RequestService = async (req, res) => {
  const { email, edirrName, Reason, postImage, creator } = req.body;
  console.log(email);
  Edirs.updateOne({ NameOfeDirr: edirrName }, { $push: { Request: { Email: email, Reason: Reason, Evidence: postImage, Payment: "Not Paid", Edirr: edirrName } } }, (err, doc) => {
    if (err) return console.log(err);
    User.updateOne({ email: creator }, { $push: { Notification: [{ text: email + " wants to request your edirr for " + Reason, name: email, edirr: edirrName }] } }, (err, doc) => {
      if (err) return console.log(err);
      console.log("Notified")
    });
    res.json(doc)

  });

}

exports.AcceptService = async (req, res) => {
  const { Email, Reason, Amount, Edirr } = req.body;
  const ch = new chapa.Chapa(
    {
      secretKey: "CHASECK_TEST-SLHPTDx9tbv7BkdaNmx45Lu4yLkcvLcF"
    }
  )

  const tx_ref = await ch.generateTransactionReference({
    prefix: 'Edir',
    size: 20
  });

  var options = {
    'method': 'POST',
    'url': 'https://api.chapa.co/v1/transaction/initialize',
    'headers': {
      'Authorization': 'Bearer CHASECK_TEST-SLHPTDx9tbv7BkdaNmx45Lu4yLkcvLcF',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "amount": Amount,
      "currency": "ETB",
      "email": Email,
      "first_name": "Yonatan",
      "last_name": "Mekonnen",
      "phone_number": "0912345678",
      "tx_ref": tx_ref,
      "callback_url": "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
      "return_url": "http://localhost:3000/my-edirr",
      "customization[title]": "Payment for my favourite merchant",
      "customization[description]": "You have paid your inital payment "
    })

  };
  //  Edirs.updateOne({NameOfeDirr: edirr},{$push:{Members:{Email:email,Payment:"Not Payed"}}},(err,doc)=>{
    var request = require('request');
  request(options, function (error, response) {
    if (error) throw new Error(error);
    Edirs.updateOne({ "NameOfeDirr": Edirr, "Request.$[].Email": Email }, { $set: { "Request.$[].Payment": "Payed" } }, (err, doc) => {
      if (err) return console.log(err);
      User.updateOne({ email: Email }, { $push: { Notification: [{ text: "you'r request have been accecpted for the reason  " + Reason }] } },
        (err, doc) => {
          if (err) return console.log(err);
          console.log("NOtified");
          // Edirs.updateOne(
          //   {email:Creator },
          //  {$pull : {Request:{name:email}}},(err,doc)=>{
          //    if (err) return console.log(err);
          //    console.log("removed the notification")



          //  })

        });
      console.log("payed")
      console.log("chapa said" + response.body);
      const respBody = JSON.parse(response.body);

      return res.json({ url: respBody.data.checkout_url });

      // console.log(respBody.data.checkout_url);
      // res=response.body;
      // return res.json(respBody);
    })
  });











  //   console.log(email);
  //   Edirs.updateOne({NameOfeDirr: edirr},{$push:{Members:{Email:email,Payment:"Not Payed"}}},(err,doc)=>{
  //     if (err) return console.log(err);
  // User.updateOne({email:email},{$push:{Notification:[{text:"you'r request have been accecpted from edirr "+edirr,edirr:edirr}]}},
  //     (err,doc)=>{
  //       if (err) return console.log(err);
  //       console.log("NOtified")
  //     });
  //     res.json(doc)

  //   });



}


exports.checkpayment = async (req, res) => {
  const { email, edirrName } = req.body;
  console.log("the name is  " + edirrName);
  const user = await Edirs.findOne({ edirrName });



  // const u = JSON.parse(user.Members);
  // console.log(u);
  const users = await Edirs.findOne({ "NameOfeDirr": edirrName, "Members.Email": email, "Members.Payment": "Not Payed" });
  // console.log(users);
  var check;
  console.log(users);
  if (!users && users == null) {
    check = "Payed";
  } else {
    check = "Not Payed";
  }
  console.log(check);
  return res.json({ check });

}

