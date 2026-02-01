import { verifyToken } from "../config/jwt.js";

function isAdminLogedIn(req, res, next) {
    try {
        const token = req.cookies.token;

        console.log("token from middleware", token);
        if (!token) {
            return res.status(401).json({ status: "failed", message: "Unauthorized" });
        }
        const decodedToken = verifyToken(token);
        console.log("token from middleware", decodedToken);
        req.adminId = decodedToken.id;
        next();
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Internal server error", error });
    }
}

export default isAdminLogedIn;