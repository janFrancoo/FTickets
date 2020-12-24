import { Message } from "node-nats-streaming";
import { Subjects, TicketCreatedEvent } from "@francofrancos/common";
import Listener from "./base_listener";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = "payments-service";
    
    onMessage(data: TicketCreatedEvent["data"], message: Message) {
        console.log("Event data:", data);
        message.ack();
    }
}

export default TicketCreatedListener;
