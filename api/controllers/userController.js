const { catchAsyncError } = require("../middlewares/catchAysncError")
const Order = require("../models/Order")
const User = require("../models/User")

exports.getMyProfile = async (req, res, next) => {
    res.send({
        success: true,
        user: req.user
    })
}

exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err)
        res.clearCookie('access_token');
        res.send({
            success: true,
            message: 'logout successfully'
        })
    })
}

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find({});
    res.send({
        success: true,
        users
    })
})

exports.getAdminStats = catchAsyncError(async (req, res, next) => {
    const usersCount = await User.countDocuments({});
    const orders = await Order.find({});

    const preparingOrders = orders.filter(order => order.orderStatus === 'preparing');
    const shippedOrders = orders.filter(order => order.orderStatus === 'shipped');
    const deliveredOrders = orders.filter(order => order.orderStatus === 'delivered');

    let totalIncome = 0;
    orders.map(order => totalIncome += order.totalAmount);

    res.send({
        success: true,
        usersCount,
        ordersCount: {
            total: orders.length,
            preparing: preparingOrders.length,
            shipped: shippedOrders.length,
            delivered: deliveredOrders.length
        },
        totalIncome
    })
})