import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const client = nats.connect("tickets", randomBytes(4).toString("hex"), {
    url: "http://localhost:4222"
});

client.on("connect", () => {
    console.log("Listener connected to NATS");

    client.on("close", () => {
        console.log("Connection closed");
        process.exit();
    });

    const options = client.subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName("accounting-service");
    const subscription = client.subscribe("ticket:created", "queue-group-name", options);

    subscription.on("message", (msg: Message) => {
        let data = msg.getData();
        if (typeof data === "string")
            data = JSON.parse(data);

        console.log("Message received", data);

        msg.ack();
    });
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
process.on("", () => client.close());
