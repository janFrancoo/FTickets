import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current_user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";

import { errorHandler } from "./middlewares/error_handler";
import { NotFoundError } from "./errors/not_found_error";

const app = express();

app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
