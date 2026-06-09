import { getAuthToken, createOrder, createPaymentKey, verifyHmac } from "../services/payment.services.js";
import db from "../models/index.js";

const { Order } = db;

const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const PAYMOB_API_URL = process.env.PAYMOB_API_URL;
const IDEA_FIXED_PRICE = process.env.IDEA_FIXED_PRICE || 500;
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET;

export const createIdeaPayment = async (req, res) => {
    try {
        const { ideaId } = req.body; 
        const user = req.user;

        if (!ideaId) {
            return res.status(400).json({ success: false, message: "Idea ID is required" });
        }

        const nameParts = user.fullname ? user.fullname.split(' ') : ['Customer', 'User'];
        const firstName = nameParts[0];

        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User'; 

        const authToken = await getAuthToken();
        
        const orderId = await createOrder(authToken, IDEA_FIXED_PRICE);
        
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            phone: "NA"
        };

        const paymentKey = await createPaymentKey(authToken, orderId, IDEA_FIXED_PRICE, userData);
        
        await Order.create({ orderId, userId: user.id, ideaId: ideaId });

        const iframeUrl = `${PAYMOB_API_URL}/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
        
        res.status(200).json({ 
            success: true, 
            iframeUrl,
            orderId 
        });
    } catch (error) {
        console.error("Error creating payment:", error.message);
        res.status(500).json({ success: false, error: "Payment initiation failed" });
    }
};

export const transactionCallback = async (req, res) => {
    try {
        const hmacFromQuery = req.query.hmac;
        const paymentData = req.body.obj;

        // 1. التأكد من أن الطلب قادم من Paymob باستخدام HMAC
        const isValidHmac = verifyHmac(
            { ...paymentData, hmac: hmacFromQuery }, 
            PAYMOB_HMAC_SECRET
        );

        if (!isValidHmac) {
            return res.status(403).json({ success: false, message: "Invalid HMAC signature" });
        }

        if (paymentData.success === true) {
            const orderId = paymentData.order.id;

            const order = await Order.findOne({ orderId });
            if (order) {
                order.status = 'paid';
                await order.save();
            }
            
            console.log(`Payment successful for Order ID: ${orderId}`);
        } else {
            console.log(`Payment failed for Order ID: ${paymentData.order.id}`);
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).send("Server Error");
    }
};