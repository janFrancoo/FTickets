import { Message } from "node-nats-streaming";
import { Subjects, Listener, ExpirationCompletedEvent, OrderStatus } from "@francofrancos/common";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order_cancelled_publisher";
import { natsWrapper } from "../../nats_wrapper";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
    queueGroupName = "orders-service";
    async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId).populate("ticket");

        if (!order)
            throw new Error("Order not found");

        if (order.status === OrderStatus.Complete)
            return msg.ack();

        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }
}
