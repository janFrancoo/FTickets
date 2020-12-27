import { OrderCreatedListener } from "./events/listeners/order_created_listener";
import { natsWrapper } from "./nats_wrapper";

const start = async () => {
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

        new OrderCreatedListener(natsWrapper.client).listen();

        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }
};

start();
