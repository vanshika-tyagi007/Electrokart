const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkUser = async (req, res, next) => {
    let token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
};

module.exports = { checkUser };
