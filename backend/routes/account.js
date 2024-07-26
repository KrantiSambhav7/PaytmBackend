const express = require("express");
const accountRouter = express.Router();
const {User,Account} = require("../db");
const authMiddleWare = require("../middleware");

accountRouter.get('/' ,authMiddleWare, async (req,res) =>{
    const account = await Account.findOne({
        userId  : req.userId
    })
    res.json({
        balance : account.balance
    })
})

accountRouter.post("/transfer" ,authMiddleWare ,async  (req,res) => {
    const {amount , to} = req.body ;
    const account = await Account.findOne({
        userId : req.userId
    })

    if(account.balance < amount){
        return res.json({
            Message : "Insufficient Balance"
        })
    }

    const toAccount = await Account.findOne({
        userId  : to
    })

    if(!toAccount){
        return res.json({
            Message : "User does not exist"
        })
    }

    await Account.updateOne({
        userId : req.userId
    } ,{$inc : {
        balance : -amount
    }})

    await Account.updateOne({
        userId : to
    } , {
        $inc : {
            balance : amount
        }
    })

    res.json({
        Message : "Successful Transaction"
    })
})

module.exports = accountRouter ;