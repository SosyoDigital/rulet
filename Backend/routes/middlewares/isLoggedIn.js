const jwt = require('jsonwebtoken')
const jwtSecret = "casualita";
module.exports = {isLoggedIn: function isLoggedIn (req, res, next){
    const token = req.header('x-auth-token') // Check for token in header
    if(!token) return res.status(200).json({msg: 'Authorization denied! No token!'})
    try{
    const decoded = jwt.verify(token, jwtSecret)
    //Add user from payload
    req.user = decoded
    next();
     } catch (e) {
         res.status(200).json({msg: 'Token is not valid!'})
     }
}
}
