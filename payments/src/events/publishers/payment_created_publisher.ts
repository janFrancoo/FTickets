import { Publisher, Subjects, PaymentCreatedEvent } from "@francofrancos/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
