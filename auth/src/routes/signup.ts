import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request_validation_error";
import { BadRequestError } from "../errors/bad_request_error";
import { User } from "../models/user";

const router = express.Router();

router.post("/api/users/signup", [
        body("email")
            .isEmail()
            .withMessage("E-mail must be valid"),
        body("password")
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be between 4 and 20 chars")
    ], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
        throw new BadRequestError("E-mail in use");

    // hash pass later

    const user = User.build({ email, password });
    await user.save();
    
    res.status(201).send(user);
});

export { router as signupRouter };
