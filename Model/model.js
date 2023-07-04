const mongoose= require("mongoose");




const MemberSchema = new mongoose.Schema({

  Id:String,
  userName:{ type: String,
    unique: true}, 
});


const MemberSchemaa = new mongoose.Schema({
  Id:String,
  Payment: String, 
  userName:String,
  
});

const RequestSchema = new mongoose.Schema({
  Id:String,
  Reason:String,
  Evidence: String,
  Payment: String, 
  Date:String,
  Edirr:String,
  

});


const MonthlyPayment = new mongoose.Schema({
  Id:String,
  Date:String,
  Amount:String,
  

});

const EdirrSchema = new mongoose.Schema(
  {    
    
      
        NameOfeDirr:String,    
        eDirrType:String,
        Amount:String,
        PaymentDuration:String,
        PaymentDay:String,
        Description:String,
        Creator:String,
        Member:[MemberSchema],
        Members:[MemberSchemaa],
        Request:[RequestSchema],
        MonthlyPayment:[MonthlyPayment],
      },{timestamps:true},


  
  {
      collection: "Edirs",

  }

);

const Edirs =mongoose.model("Edirs", EdirrSchema);


module.exports = Edirs;
