const express = require("express");
const app = express();
app.use(express.json());
const chapa = require("chapa-nodejs");
const bcrypt = require("bcryptjs");
const cors = require("cors");
app.use(cors());
var User = require("../Model/UserModel");
var Admin = require("../Model/AdminModel");
var Edirs = require("../model/model");
const jwt = require("jsonwebtoken");
const { Job } = require("node-schedule");

const JWT_SECRET =
  "nhjndshnbhsiduy78q3ye3yhrewhriewopfew[fpe-fpe-pf[df[s;f[ds;f[ds;f[ds;f[ds;,fld,s.mdnshbgvcarfdtwygyqgygdhsabjbcnvgawqrr6t8siahjdvdgvds()!@#$%^&*";

// exports.test = async () => {
//   //7/2/2023
//   const date = new Date(); // Create a new Date object with the current date and time

//   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Convert to string and pad with 0 if needed
//   const day = date.getDate().toString().padStart(2, "0"); // Convert to string and pad with 0 if needed
//   const year = date.getFullYear();
//   const formattedDate = `${year}-${month}-${day}`;
//   console.log(formattedDate);
//   var paymentsofar = 0;
//   const Edir = await Edirs.find({ PaymentDay: formattedDate });
//   console.log(Edir, "the edirr are");
//   var Store = [];
//   Edir.forEach((eDir) => {
//     eDir.Members.forEach((members) => {
//       Store = Store.concat(members.userName);
//     });
//   });
//   // console.log(Store);

//   Store.forEach(async (userName) => {
//     const paymentNotification = await Edirs.find({
//       "Members.userName": userName,
//       PaymentDay: formattedDate,
//     });
//     // console.log(paymentNotification);
//     paymentNotification.forEach((PN) => {
//       console.log(PN.NameOfeDirr, PN.Amount);
//       User.updateOne(
//         { userName: userName },
//         {
//           $push: {
//             Notification: [
//               {
//                 text: "Your monthly payment is due ",
//                 edirr: PN.NameOfeDirr,
//                 type: "mPayment",
//                 Date: formattedDate,
//                 Payment: PN.Amount,
//               },
//             ],
//           },
//         },
//         (err, doc) => {
//           if (err) return console.log(err);
//           console.log("NOtified");
//           paymentsofar++;
//           Edirs.updateMany(
//             { NameOfeDirr: PN.NameOfeDirr },
//             { $set: { PaymentSofar: paymentsofar } },
//             (err, doc) => {
//               if (err) return console.log(err);
//               return doc;
//             }
//           );
//         }
//       );
//     });
//   });
//   //
// };

exports.runOnceADay = async () => {
 //7/2/2023
 const date = new Date(); // Create a new Date object with the current date and time

 const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Convert to string and pad with 0 if needed
 const day = date.getDate().toString().padStart(2, "0"); // Convert to string and pad with 0 if needed
 const year = date.getFullYear();
 const formattedDate = `${year}-${month}-${day}`;
 console.log(formattedDate);
 var paymentsofar = 0;
 const Edir = await Edirs.find({ PaymentDay: formattedDate });
 console.log(Edir, "the edirr are");
 var Store = [];
 Edir.forEach((eDir) => {
   eDir.Members.forEach((members) => {
     Store = Store.concat(members.userName);
   });
 });
 // console.log(Store);

 Store.forEach(async (userName) => {
   const paymentNotification = await Edirs.find({
     "Members.userName": userName,
     PaymentDay: formattedDate,
   });
   // console.log(paymentNotification);
   paymentNotification.forEach((PN) => {
     console.log(PN.NameOfeDirr, PN.Amount);
     User.updateOne(
       { userName: userName },
       {
         $push: {
           Notification: [
             {
               text: "Your monthly payment is due ",
               edirr: PN.NameOfeDirr,
               type: "mPayment",
               Date: formattedDate,
               Payment: PN.Amount,
             },
           ],
         },
       },
       (err, doc) => {
         if (err) return console.log(err);
         console.log("NOtified");
         paymentsofar++;
         Edirs.updateMany(
           { NameOfeDirr: PN.NameOfeDirr },
           { $set: { PaymentSofar: paymentsofar } },
           (err, doc) => {
             if (err) return console.log(err);
             return doc;
           }
         );
       }
     );
   });
 });
 //
};
exports.register = async (req, res) => {
  const { data } = req.body;

  var userName = data.userName;
  var fullName = data.fullName;
  var phoneNumber = data.phoneNumber;
  var Gender = data.gender;
  var Department = data.department;
  var email = data.email;
  var password = data.password;
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
      Gender,
      Department,
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
};
exports.loginUser = async (req, res) => {
  try {
    const { data } = req.body;
    var userName = data.userName;
    var password = data.password;
    // const { userName, password } = req.body;
    console.log("emaillll", 0);
    const user = await User.findOne({ userName });

    if (!user) {
      return res.json({ error: "User Not found" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.userName }, JWT_SECRET, {
        expiresIn: "15m",
      });
      const _id = user._id;
      const role = user.role;
      const fullName = user.fullName;
      const userName = user.userName;
      const email = user.email;
      const Gender = user.Gender;
      const Department = user.Department;

      if (res.status(201)) {
        if (role === "user" || role === "Creator") {
          return res.json({
            status: "ok",
            _id,
            userName,
            role,
            email,
            fullName,
            Gender,
            Department,
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
  const { data } = req.body;
  console.log(data);
  var NameOfeDirr = data.edirrName;
  var Amount = data.amount;
  var PaymentDuration = data.paymentEvery;
  var PaymentDay = data.paymentDay;
  var Description = data.description;
  var Creator = data.Creator;

  try {
    await Edirs.create({
      NameOfeDirr,
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
  const { data } = req.body;
  var userName = data.userName;
  var NameOfeDirr = data.NameOfeDirr;
  var Creator = data.Creator;

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
      { userName: Creator },
      {
        $push: {
          Notification: [
            {
              text: userName + " wants to join your edirr",
              name: userName,
              type: "join",
              edirr: NameOfeDirr,
            },
          ],
        },
      }
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
  const { data } = req.body;
  const userName = data.userName;
  const edirr = data.NameOfEdirr;
  const Creator = data.Creator;
  const Notification_id = data._id;
  console.log("accept111");
  console.log(Creator);

  try {
    await Edirs.updateOne(
      { NameOfeDirr: edirr },
      { $push: { Members: { userName: userName } } }
    );

    const dataEdirr = await Edirs.findOne({ NameOfeDirr: edirr });
    const Amount = dataEdirr.Amount;
    const paymentsofar = parseInt(dataEdirr.PaymentSofar);
    console.log(dataEdirr, "edirr");

    console.log(Amount, "amount");

    console.log(paymentsofar, "payment sofar");

    const datapayment = await User.findOne(
      { userName: userName },
      "Paymenthistory"
    );
    console.log(datapayment.Paymenthistory.length, "paymenthistory");

    if (paymentsofar === 0) {
      await User.updateOne(
        { userName: userName },
        {
          $push: {
            Notification: [
              {
                text: "You have joined the edir. Please pay your payment on the payment day.",
                edirr: edirr,
                Payment: Amount,
                type: "normal",
              },
            ],
          },
        }
      );

      await User.updateOne(
        { userName: Creator },
        { $pull: { Notification: { _id: Notification_id } } }
      );
    } else {
      console.log("hello");
      if (datapayment.Paymenthistory.length === 0) {
        console.log("inside");
        const initalpayment = Amount * paymentsofar;
        await User.updateOne(
          { userName: userName },
          {
            $push: {
              Notification: [
                {
                  text: "You have joined. Please pay your initial payment to proceed.",
                  edirr: edirr,
                  type: "iPayment",
                  Payment: initalpayment,
                },
              ],
            },
          }
        );

        await User.updateOne(
          { userName: Creator },
          { $pull: { Notification: { _id: Notification_id } } }
        );
      }
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error(error);
    return res.json({ status: "error", error: error.message });
  }
};

exports.payment = async (req, res) => {
  const date = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthIndex = date.getMonth();
  const currentMonthName = monthNames[currentMonthIndex];

  const { data } = req.body;
  const { Amount, NameOfEdirr, userName ,Notification_id} = data;

  try {
    await User.updateOne(
      { userName: userName },
      {
        $push: {
          Paymenthistory: {
            Amount: Amount,
            edirr: NameOfEdirr,
            Date: date,
            Month: currentMonthName,
          },
        },
      }
    );

    const updatedEdirr = await Edirs.findOneAndUpdate(
      {
        NameOfeDirr: NameOfEdirr,
        [`MonthlyPayment.${currentMonthName}`]: { $exists: true },
      },
      {
        $push: {
          [`MonthlyPayment.${currentMonthName}`]: {
            userName,
            Amount,
            Date: date,
          },
        },
      },
      { new: true }
    );

    if (!updatedEdirr) {
      return res.json({
        status: "error",
        error: "Edirr or matching month not found",
      });
    }
    const data = await Edirs.findOne(
      { NameOfeDirr: NameOfEdirr },
      "TotalAmount"
    );

    if (!data) {
      throw new Error("Edirr not found");
    }
    var amountn = parseInt(Amount);
    console.log(data.TotalAmount);
    var TotalAmount = parseInt(data.TotalAmount);
    var newAmount = TotalAmount + amountn;
    console.log(data);
    Edirs.updateMany(
      { NameOfeDirr: NameOfEdirr },
      { $set: { TotalAmount: newAmount } },
      (err, doc) => {
        if (err) return console.log(err);
        console.log(doc);
        // res.json(doc)
      }
    );
    console.log("total Payment added ");

    console.log("Payment recorded successfully");

    await User.updateOne(
      { userName: userName },
      { $pull: { Notification: { _id: Notification_id } } }
    );


    return res.json({ status: "ok" });

    
  } catch (error) {
    console.error(error);
    return res.json({ status: "error", error: error.message });
  }
};

exports.LeaveEdirr = async (req, res) => {
  const { data } = req.body;
  var id = data.id;
  var userName = data.userName;
  console.log(id);
  console.log(userName);

  try {
    const updatedEdirs = await Edirs.findOneAndUpdate(
      { _id: id },
      { $pull: { Members: { userName: userName } } },
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
exports.Getuser = async (req, res) => {
  User.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(data.length);
      res.status(200).send(data);
    }
  });
};
exports.Getmemb = async (req, res) => {
  const { data } = req.body;
  var edirrName = data.edirrName;
  console.log(edirrName);

  try {
    const data = await Edirs.findOne(
      { NameOfeDirr: edirrName },
      "Member"
    ).exec();

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
  // try {
  // const eDirr = await Edirs.findOne({});
  Edirs.find((err, data) => {
    if (err) {
      res.send("there is no edir");
    } else {
      res.status(200).send(data);
    }
  });

  // if (!eDirr) {
  //   throw new Error("No eDirr found");
  // }
  // return res.json({
  //   status: "ok",
  //   eDirr
  // }).sort({createdAt: -1});
  // } catch (error) {
  //   console.error(error);
  //   return res.json({
  //     status: "error",
  //     error: error.message
  //   });
  // }
};
exports.profile = async (req, res) => {
  const { data } = req.body;
  var userName = data.userName;

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
  const { data } = req.body;
  var email = data.email;
  var edirrName = data.edirrName;
  var toDay = data.toDay;

  console.log("the name is  " + edirrName);
  console.log(toDay);

  const users = await Edirs.findOne({
    NameOfeDirr: edirrName,
    "MonthlyPayment.Email": email,
    "MonthlyPayment.Date": toDay,
  });

  var check;
  console.log(users);
  if (!users && users === null) {
    check = "Not Payed";
  } else {
    check = "Payed";
  }
  console.log(check);
  return res.json({ check });
};
exports.RequestService = async (req, res) => {
  const { data } = req.body;
  var userName = data.userName;
  var edirrName = data.edirrName;
  var Reason = data.Reason;
  var creator = data.creator;

  console.log(userName);

  try {
    const updateEdirs = await Edirs.updateOne(
      { NameOfeDirr: edirrName },
      {
        $push: {
          Request: {
            userName: userName,
            Reason: Reason,
            Payment: "Not Paid",
            Edirr: edirrName,
          },
        },
      }
    ).exec();

    if (!updateEdirs) {
      throw new Error("Failed to update Edirs");
    }

    const updateUser = await User.updateOne(
      { userName: creator },
      {
        $push: {
          Notification: [
            {
              text: userName + " wants to request your edirr for " + Reason,
              name: userName,
              edirr: edirrName,
              type: "request",
            },
          ],
        },
      }
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
exports.AcceptService = async (req, res) => {
  const { data } = req.body;
  var userName = data.userName;
  var Reason = data.Reason;
  var Amount = data.Amount;
  var Edirr = data.Edirr;
  var _id = data._id;
  var Creator = data.Creator;
  try {
    Edirs.updateOne(
      { NameOfeDirr: Edirr, "Request.$[].userName": userName },
      { $set: { "Request.$[].Payment": "Paid" } },
      (err, doc) => {
        if (err) {
          throw new Error(err);
        }
        User.updateOne(
          { userName: userName },
          {
            $push: {
              Notification: [
                {
                  text:
                    "Your request has been accepted for the reason " + Reason,
                  Payment: Amount,
                },
              ],
            },
          },
          async (err, doc) => {
            if (err) {
              throw new Error(err);
            }

            console.log("Notified");

            await User.updateOne(
              { userName: Creator },
              { $pull: { Notification: { _id: _id } } }
            );

            User.updateOne(
              { userName: userName },
              {
                $push: {
                  Granted: [
                    {
                      text:
                        "The edirr crator have funded you with this amount money" +
                        Amount +
                        "For the folowing reason  " +
                        Reason,
                      Amount: Amount,
                      edirr: Edirr,
                    },
                  ],
                },
              },
              async (err, doc) => {
                if (err) {
                  throw new Error(err);
                }
                const data = await Edirs.findOne(
                  { NameOfeDirr: Edirr },
                  "TotalAmount"
                );

                if (!data) {
                  throw new Error("Edirr not found");
                }
                console.log(data.TotalAmount);
                var TotalAmount = parseInt(data.TotalAmount);
                var remaningAmount = TotalAmount - Amount;
                console.log(data);
                Edirs.updateMany(
                  { NameOfeDirr: Edirr },
                  { $set: { TotalAmount: remaningAmount } },
                  (err, doc) => {
                    if (err) return console.log(err);
                    console.log(doc);
                    // res.json(doc)
                  }
                );
                console.log("Granted");
              }
            );
          }
        );
        res.json({ status: "ok" });
      }
    );
  } catch (error) {
    console.error(error);
    res.json({ status: "error", error: error.message });
  }
};
exports.checkpayment = async (req, res) => {
  const { data } = req.body;
  var userName = data.userName;
  var edirrName = data.edirrName;

  console.log("the name is  " + edirrName);

  const users = await Edirs.findOne({
    NameOfeDirr: edirrName,
    "Members.userName": userName,
    "Members.Payment": "Not Payed",
  });
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
};

exports.rejectUser = async (req, res) => {
  const { data } = req.body;
  var Notification_id = data.Notification_id;
  var userName = data.userName;
  var NameOfEdirr = data.NameOfEdirr;
  var Creator = data.Creator;
  console.log(data);


  // var
  // console.log(id);
  // console.log(userName);

  try {
    await User.updateOne(
      { userName: userName },
      {
        $push: {
          Notification: [
            {
              text: "Your request have been denied",
              edirr: NameOfEdirr,
              type: "normal",
              name: Creator,
            },
          ],
        },
      }
    );

    const notif = await User.updateOne(
      { userName: Creator },
      { $pull: { Notification: { _id: Notification_id } } }
    );
    if (!notif) {
      throw new Error("noification not found");
    }

    console.log("notification removed");
    const updatedEdirs = await Edirs.findOneAndUpdate(
      { NameOfEdirr: NameOfEdirr },
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

exports.removeUser = async (req, res) => {
  const { data } = req.body;
  var id = data._id;
  console.log(data);
  try {
    // Find the user by ID and remove them
    const result = await User.findByIdAndRemove(id);

    if (result) {
      console.log("User removed successfully:", result);
      res.status(200).send(result);
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).send(error);
  }
};


exports.removeUseredirr = async (req, res) => {

  const { data } = req.body;
  var NameOfEdirr = data.NameOfeDirr;
  var userName = data.userName;

  console.log(data);
  try {
    const removemembers = await Edirs.updateOne(
      { NameOfeDirr: NameOfEdirr },
      { $pull: { Members: { userName: userName } } }
    );
    if (!removemembers) {
      throw new Error("members not found");
    }

    const removemember = await Edirs.updateOne(
      { NameOfeDirr: NameOfEdirr },
      { $pull: { Member: { userName: userName } } }
    );
    if (!removemember) {
      throw new Error("member not found");
    }
       console.log("memeber removed");
    // Find the user by ID and remove them
  
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).send(error);
  }
};
exports.removeEdirr = async (req, res) => {
  const { data } = req.body;
  var id = data._id;
  console.log(data);
  try {
    // Find the user by ID and remove them
    const result = await Edirs.findByIdAndRemove(id);

    if (result) {
      console.log("Edir removed successfully:", result);
      res.status(200).send(result);
    } else {
      console.log("Edir not found");
    }
  } catch (error) {
    console.error("Error removing Edir:", error);
    res.status(500).send(error);
  }
};

exports.ResetPassword = async (req, res) => {
  const { newPassword, userName } = req.body;
  console.log(newPassword, email);
  // Edirs.updateOne({ "NameOfeDirr": edirrName }, { $set: { "Members.$[].Payment": "Payed" } }, (err, doc) => {
  const encreptedPassword = await bcrypt.hash(newPassword, 10);
  User.updateOne(
    { userName: userName },
    { $set: { password: encreptedPassword } },
    (err, doc) => {
      if (err) return console.log(err);
      return res.json({ doc });
    }
  );
  // $elemMatch: { "Creator": email }
};
exports.UpdateAccount = async (req, res) => {
  const { data } = req.body;
  console.log(data);
  var _id = data.id;

  var fullName = data.fullName;
  var email = data.email;
  var phoneNumber = data.phoneNumber;

  var Department = data.department;

  console.log("update", fullName, email, phoneNumber, Department);

  User.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        Department: Department,
      },
    },
    { new: true },
    (err, doc) => {
      if (err) return console.log(err);
      return res.json({ doc });
    }
  );
};

exports.Alert = async (req, res) => {
  try {
    const { data } = req.body;
    // console.log(data);
    const { userName, NameOfeDirr } = data;
    const Edir = await Edirs.findById({ _id: NameOfeDirr });
    var NameOfEdirr = Edir.NameOfeDirr;
    var amount = Edir.Amount;
    console.log(Edir);
    console.log("the name ", NameOfEdirr);
    console.log("the amount ", amount);

    await User.updateOne(
      { userName: userName },
      {
        $push: {
          Notification: [
            {
              text: "Your monthly payment is due",
              edirr: NameOfEdirr,
              type: "mPayment",
              // Date: formattedDate,
              Payment: amount,
            },
          ],
        },
      }
    );

    console.log("Notified");
    res.json({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", error: error.message });
  }
};

exports.RejectService = async (req, res) => {
  try {
    const { data } = req.body;
    // console.log(data);
    const { userName, NameOfeDirr, Creator, Notification_id } = data;

  
    await User.updateOne(
      { userName: userName },
      {
        $push: {
          Notification: [
            {
              text: "Your Service request have been denied",
              edirr: NameOfeDirr,
              type: "normal",
              name: Creator,
            },
          ],
        },
      }
    );

    console.log("Notified");

    await User.updateOne(
      { userName: Creator },
      { $pull: { Notification: { _id: Notification_id } } }
    );
    res.json({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", error: error.message });
  }
};
