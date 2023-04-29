const router = require('express').Router();
const passport = require('passport');
const { getMyProfile, logout, getAllUsers, getAdminStats } = require('../controllers/userController');
const { isAuth, isAdmin } = require('../middlewares/auth');

// routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile'],
}));

// router.get('/login', passport.authenticate('google', {
//     scope:['profile'],
//     successRedirect: process.env.FRONTEND_URL
// }))

router.get('/login', passport.authenticate('google'), (req, res)=>{
    res.send({
        success: true,
        message: 'User logged In'
    })
})

router.get('/me', isAuth, getMyProfile);
router.get('/logout', isAuth, logout);

router.get('/admin/all', isAuth, isAdmin, getAllUsers);

router.get('/admin/stats', isAuth, isAdmin, getAdminStats);

module.exports = router;