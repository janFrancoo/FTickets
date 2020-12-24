import { Publisher, Subjects, TicketUpdatedEvent } from "@francofrancos/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
