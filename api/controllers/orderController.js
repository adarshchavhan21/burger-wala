const Order = require('../models/Order');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { createError } = require('../utils/createError');
const { catchAsyncError } = require('../middlewares/catchAysncError');
const Razorpay = require('razorpay')
const crypto = require('crypto');

exports.placeOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.create({
        ...req.body,
        user: req.user._id
    });

    res.status(201).send({
        success: true,
        message: 'Order placed successfully via COD',
        order
    });
})

exports.placeOrderOnline = catchAsyncError(async (req, res, next) => {
    let instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET_SECRET
    });

    const options = {
        amount: Number(req.body.totalAmount),
        currency: "INR"
    };
    const order = await instance.orders.create(options)

    res.status(201).send({
        success: true,
        order,
        orderOptions: req.body
    });
})

exports.paymentVerification = catchAsyncError(async (req, res, next) => {
    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        orderOptions
    } = req.body;

    const body = razorpay_payment_id + '|' + razorpay_order_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_SECRET).update(body).digest('hex');

    if (razorpay_signature !== expectedSignature) {
        return next(createError(400, 'Payment failed'))
    }

    const payment = await Payment.create({ ...req.body });

    const order = await Order.create({ ...orderOptions, paidAt: new Date(Date.now()), paymentInfo: payment._id });

    res.status(201).send({
        success: true,
        message: 'Order placed successfully via Online',
        order
    })
})

exports.getMyOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user?._id }).populate('user', 'name');

    res.send({
        success: true,
        orders
    });
})

exports.getOrderDetails = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name');

    if (!order) {
        return next(createError(404, 'Order not found'))
    }

    res.send({
        success: true,
        order
    });
})

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({}).populate('user', 'name');

    res.send({
        success: true,
        orders
    });
})

exports.processOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name');

    if (!order) {
        return next(createError(404, 'Order not found'))
    }

    if (order.orderStatus === 'preparing') {
        order.orderStatus = 'shipped';
    } else if (order.orderStatus === 'shipped') {
        order.orderStatus = 'delivered';
        order.deliveredAt = new Date(Date.now());
    } else if (order.orderStatus === 'delivered') {
        return next(createError(400, 'Order already deliverd'))
    }

    await order.save();

    res.send({
        success: true,
        message: 'Order status updated'
    });
})
