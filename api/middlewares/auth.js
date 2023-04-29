const { createError } = require("../utils/createError");

exports.isAuth = (req, res, next) => {
    const {access_token} = req.cookies;
    if(!access_token){
        return next(createError(401, 'User not logged'))
    }
    next();
}


exports.isAdmin = (req, res, next) => {
    if(req.user?.role !== 'admin'){
        return next(createError(405, 'Only admin allowed'));
    }
    next();
}