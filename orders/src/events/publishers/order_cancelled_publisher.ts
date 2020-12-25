import { Publisher, Subjects, OrderCancelledEvent } from "@francofrancos/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
