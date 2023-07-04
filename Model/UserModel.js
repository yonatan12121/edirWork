const mongoose= require("mongoose");

const Paymenthistory = new mongoose.Schema(
  {
  
    Amount:String,
    edirr:String,
    Date:String,
    
  },{timestamps:true},
)


const NotificationScehma = new mongoose.Schema(
    {
      text:String,
      name:String,
      edirr:String,
      type:String,
      Payment:String, 
      Date:String,
      
    }
  )
  const UserDetailsScehma = new mongoose.Schema(
    {
      userName:{ type: String,
        unique: true},      
      fullName: String,
      phoneNumber: { type: String,
        unique: true},
      email: { type: String,
        unique: true},
      password: String,
      Notification:[NotificationScehma],
      role: String,
      Paymenthistory:[Paymenthistory]

      
    },
    {
        collection: "Users",

    }

);
const User = mongoose.model("Users", UserDetailsScehma);
module.exports = User;