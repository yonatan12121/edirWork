const mongoose= require("mongoose");




const MemberSchema = new mongoose.Schema({

  Id:String,
  userName:{ type: String, unique: false }, 
});


const MemberSchemaa = new mongoose.Schema({
  Id:String,
  Payment: String, 
  userName:String,
  
});

const RequestSchema = new mongoose.Schema({
  userName:String,
  Reason:String,
  Evidence: String,
  Payment: String, 
  Date:String,
  Edirr:String,
  

},{timestamps:true},);


const paymentDetailSchema = new mongoose.Schema({
  Id:String,
  Date:String,
  userName:String,
  Amount:String,
  

});





const EdirrSchema = new mongoose.Schema(
  {    
    
      
        NameOfeDirr:String,    
        Amount:String,
        PaymentDuration:String,
        PaymentDay:String,
        Description:String,
        CurentPaymentDay:String,
        Creator:String,
        Member:[MemberSchema],
        Members:[MemberSchemaa],
        Request:[RequestSchema],
        MonthlyPayment: {
          January: [paymentDetailSchema],
          February: [paymentDetailSchema],
          March: [paymentDetailSchema],
          April: [paymentDetailSchema],
          May: [paymentDetailSchema],
          June: [paymentDetailSchema],
          July: [paymentDetailSchema],
          August: [paymentDetailSchema],
          September: [paymentDetailSchema],
          October: [paymentDetailSchema],
          November: [paymentDetailSchema],
          December: [paymentDetailSchema]
        },
        TotalAmount:String,
      },{timestamps:true},


  
  {
      collection: "Edirs",

  }

);

const Edirs =mongoose.model("Edirs", EdirrSchema);


module.exports = Edirs;
