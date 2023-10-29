import jwt from "jsonwebtoken";
import 'dotenv/config';

export class Auth{
    async verifyToken(token){
        const decodedToken = await jwt.verify(token, process.env.JWTTOKEN_DEV);
        const {userId} = decodedToken;
        return userId;
    }
}