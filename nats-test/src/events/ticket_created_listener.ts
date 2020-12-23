import { Message } from "node-nats-streaming";
import Listener from "./base_listener";
import { TicketCreatedEvent } from "./ticket_created_event";
import { Subjects } from "./subjects";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = "payments-service";
    
    onMessage(data: TicketCreatedEvent["data"], message: Message) {
        console.log("Event data:", data);
        message.ack();
    }
}

export default TicketCreatedListener;
