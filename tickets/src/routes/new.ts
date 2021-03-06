import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@francofrancos/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket_created_publisher";
import { natsWrapper } from "../nats_wrapper";

const router = express.Router();

router.post("/api/tickets", 
    requireAuth, 
    [body("title")
        .not()
        .isEmpty()
        .withMessage("Title is required"),
    body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0")],
    validateRequest,
    async (req: Request, res: Response) => { 
        const ticket = Ticket.build({
            userId: req.currentUser?.id,
            ...req.body
        });
        await ticket.save();

        new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id!,
            version: ticket.version!,
            title: ticket.title!,
            price: ticket.price!,
            userId: ticket.userId!
        });

        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
