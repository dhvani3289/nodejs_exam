const jwt = require("jsonwebtoken");
const user = require("../model/user.model");S

exports.verifyToken = async (req, res, next) => {
    try {
        let token = req.headers["authorization"].split(" ")[1];
        console.log(token, "token");
        if (!token) {
            return res.json({ message: "Token missing!!!!" });
        }
        let { userId } = jwt.verify(token, "taskManagement");
        console.log(userId, "userId");
        let findUser = await user.findById(userId);
        if (findUser) {
            req.user = findUser;
            next();
        } else {
            return res.json({ message: "User not Found" })
        }
    } catch (error) {
        console.log(error);
        return res.json({ message: "Server Error" });
    }
};
