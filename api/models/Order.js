const {Schema, model} = require('mongoose');

const orderSchema = new Schema({
    shippingInfo: {
        houseNo: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pinCode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        }
    },
    orderItems: {
        cheeseBurger: {
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        },
        vegCheeseBurger: {
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        },
        burgerWithFries: {
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    paymenMethod: {
        type: String,
        enum: ['COD', 'online'],
        default: 'online'
    },
    paymentInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    },
    paidAt: Date,
    itemPrice: {
        type: Number,
        default: 0
    },
    taxPrice: {
        type: Number,
        default: 0
    },
    shippingCharges: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    orderStatus: {
        type: String, 
        enum: ['preparing', 'shipped', 'delivered'],
        default: 'preparing'
    },
    deliveredAt: Date,
}, {timestamps: true});

module.exports = model('Order', orderSchema);