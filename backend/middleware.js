const JWT_SECRET = require("./config");
const JWT = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleWare = (req,res,next) => {
    const authHeader = req.headers.authorization ;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403)
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        if(decoded.userId){
            req.userId = decoded.userId;
            next();
        }else{
            return res.status(403);
        }
    }catch(err){
        return res.json({
            Message : "Error"
        })
    }
}

module.exports = authMiddleWare ; 
