const mongoose = require("mongoose");

const Paymenthistory = new mongoose.Schema(
  {
    Amount: String,
    edirr: String,
    Date: String,
    Month: String,
  },
  { timestamps: true }
);
const Granted = new mongoose.Schema(
  {
    text: String,
    name: String,
    edirr: String,
    Amount: String,
  },
  { timestamps: true }
);

const NotificationScehma = new mongoose.Schema(
  {
    text: String,
    name: String,
    edirr: String,
    type: String,
    Payment: String,
    Date: String,
  },
  { timestamps: true }
);
const UserDetailsScehma = new mongoose.Schema(
  {
    userName: { type: String, unique: true },
    fullName: String,
    phoneNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    Gender: String,
    Department: String,
    Notification: [NotificationScehma],
    role: String,
    Paymenthistory: [Paymenthistory],
    Granted: [Granted],
  },
  {
    collection: "Users",
  }
);
const User = mongoose.model("Users", UserDetailsScehma);
module.exports = User;
