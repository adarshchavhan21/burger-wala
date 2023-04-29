const { placeOrder, getMyOrders, getOrderDetails, getAllOrders, processOrder, placeOrderOnline, paymentVerification } = require('../controllers/orderController');
const { isAuth, isAdmin } = require('../middlewares/auth');
const router = require('express').Router();

router.post('/placeorder', isAuth, placeOrder)
router.post('/placeorder/online', isAuth, placeOrderOnline)
router.post('/payment/verify', isAuth, paymentVerification);
router.get('/myorders', isAuth, getMyOrders);
router.get('/order/:id', isAuth, getOrderDetails);

router.get('/admin/all', isAuth, isAdmin, getAllOrders);
router.get('/admin/order/:id',isAuth, isAdmin, processOrder);

module.exports = router;