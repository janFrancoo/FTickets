import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket_created_publisher";

console.clear();

const client = nats.connect("tickets", "abc", {
    url: "http://localhost:4222"
});

client.on("connect", async () => {
    console.log("Publisher connected to NATS");

    const publisher = new TicketCreatedPublisher(client);

    try {
        await publisher.publish({
            id: "asd",
            title: "asd",
            price: 100
        });
    } catch (err) {
        console.error(err);
    }
});
