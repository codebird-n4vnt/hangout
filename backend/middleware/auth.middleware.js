import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req,res,next) =>{
    try {
        let token = req.cookies.token;
        if(!token){
            return res.status(400).json({message:"Unauthorised - token not found"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:"Unauthorised - invalid token"})
        }
        let user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"User not found"})
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({message : `protectroute error : ${err}`});
    }
}