import { Publisher, Subjects, ExpirationCompletedEvent } from "@francofrancos/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
