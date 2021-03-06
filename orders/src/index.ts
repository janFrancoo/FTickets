import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats_wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket_created_listener";
import { TicketUpdatedListener } from "./events/listeners/ticket_updated_listener";
import { ExpirationCompletedListener } from "./events/listeners/expiration_completed_listener";
import { PaymentCreatedListener } from "./events/listeners/payment_created_event";

const start = async () => {
    if (!process.env.JWT_KEY)
        throw new Error("JWT_KEY not found");

    if (!process.env.MONGO_URI)
        throw new Error("MONGO_URI not found");

    if (!process.env.NATS_URL)
        throw new Error("NATS_URL not found");
        
    if (!process.env.NATS_CLUSTER_ID)
        throw new Error("NATS_CLUSTER_ID not found");
    
    if (!process.env.NATS_CLIENT_ID)
        throw new Error("NATS_CLIENT_ID not found");

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on("close", () => {
            console.log("Connection closed");
            process.exit();
        });
        
        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompletedListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log("Listening on port 3000");
    });
};

start();
