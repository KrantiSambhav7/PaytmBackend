const mongoose = require("mongoose");
const { string, number } = require("zod");
mongoose.connect("mongodb+srv://krantib220970me:<password>@cluster0.a2ojnnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    firstName : String,
    lastName : String,
    account : [{type : Schema.Types.ObjectId , ref : "Account"}]
})

const accountSchema = new mongoose.Schema({
    userId : string,
    balance : number,
    user : [{type : Schema.Types.ObjectId , ref : "User"}]
})

const User = mongoose.model('User', userSchema);
const Account =  mongoose.model('Account' , accountSchema);

module.exports = {
    User : User,
    Account : Account
}
