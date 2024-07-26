const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const zod = require("zod");
const User = require("../db");
const JWT_SECRET = require("../config");
const bcrypt = require("bcryptjs");
const authMiddleWare = require("../middleware");
const {User,Account} = require("../db");
const userSchemaZod = zod.object({
    username : zod.string(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
})

userRouter.post("/signup" , async (req,res) => {
    const body = req.body ; 
    const {success} = userSchemaZod.safeParse(req.body);
    if(!success){
        res.json({
            Message : "Email already taken"
        });
        return ;
    }

    const user = User.findOne({
        username : req.body.username
    })

    if(user._id){
        res.json({
            Message : "User already exists"
        })
        return ;
    }

    const saltRound = 10;
    const hash_Password = await bcrypt.hash(req.body.password , saltRound);

    const newUser = await User.create({
        username : req.body.username,
        password : hash_Password,
        firstName : req.body.firstName,
        lastName : req.body.lastName
    })

    const userID = newUser._id;

    await Account.create({
        userId : "New User " + userID,
        balance : (int)(Math.random() * 10000 )
    })

    const token = jwt.sign({
        userid : userID
    } , JWT_SECRET);

    res.json({
        Message : "User created successfully",
        token : token 
    })
    
});

const signinSchema = zod.object({
    username : zod.string(),
    passwword : zod.string()
})

userRouter.post("/signin" , async (req,res) => { 
    const body = req.body;
    const {success} = signinSchema.safeParse(body);

    if(!success){
        return res.json({
            Message : "Invalid User"
        })
    }

    const user = await User.findOne({
        username : body.username, 
    })

    if(!user){
        return res.json({
            Message : "User does not exist"
        })
    }

    const userId = user._id;

    const token = jwt.sign({
        userId : userId 
    },JWT_SECRET);

    res.json({
        token 
    })

});

const updatePasswordBody = zod.object({
    password : zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
})

userRouter.put("/" ,authMiddleWare ,async (req,res) => {
    const body = req.body;
    const {success} = updatePasswordBody.safeParse(body);

    if(!success){
        res.json({
            Message : "Invalid Request"
        })
    }
    await User.update({_id: req.userId} , req.body);
    res.json({
        Message : "User has been updated"
    })
})

userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = userRouter ;
