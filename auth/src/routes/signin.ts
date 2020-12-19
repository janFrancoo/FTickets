import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { Password } from "../services/password";
import { BadRequestError } from "../errors/bad_request_error";
import { User } from "../models/user";
import { validateRequest } from "../middlewares/validate_request";

const router = express.Router();

router.post("/api/users/signin", 
    [
        body("email")
            .isEmail()
            .withMessage("E-mail must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password must be supplied")
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            throw new BadRequestError("Invalid credentials");

        const passwordMatch = await Password.compare(
            user.password,
            password
        );

        if (!passwordMatch)
            throw new BadRequestError("Invalid credentials");

        const userJWT = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!);
    
        req.session = {
            jwt: userJWT
        };
        
        res.status(200).send(user);
    }
);

export { router as signinRouter };
