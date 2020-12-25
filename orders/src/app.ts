import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@francofrancos/common";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";

const app = express();

app.set("trust-proxy", true);

app.use(json());
app.use(cookieSession({
    signed: false,  // no encryption for content
    secure: false   // only https allowed
}));

app.use(currentUser);

app.use(newOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.use(showOrderRouter);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
