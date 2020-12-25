import { Publisher, Subjects, OrderCreatedEvent } from "@francofrancos/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
