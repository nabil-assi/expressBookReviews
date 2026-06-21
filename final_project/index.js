const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// استخدام express.json() لمعالجة بيانات الـ JSON في الـ Request body
app.use(express.json());

// إعداد الجلسة (Session)
app.use("/customer", session({
    secret: "fingerprint_customer", 
    resave: true, 
    saveUninitialized: true
}));

// نظام الـ Middleware للحماية (Authentication Middleware)
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        
        // التحقق من صحة الـ JWT
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // السماح بالمرور
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT = 5000;

// ربط المسارات
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));