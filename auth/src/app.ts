import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current_user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";

import { errorHandler, NotFoundError } from "@francofrancos/common";

const app = express();

app.set("trust-proxy", true);

app.use(json());
app.use(cookieSession({
    signed: false,  // no encryption for content
    secure: false   // only https allowed
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
