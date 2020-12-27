import { Listener, OrderCreatedEvent, Subjects } from "@francofrancos/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration_queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = "expiration";
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay: delay
        });

        msg.ack();
    }
}
