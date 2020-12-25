import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from "@francofrancos/common";
import { OrderCancelledPublisher } from "../events/publishers/order_cancelled_publisher";
import { natsWrapper } from "../nats_wrapper";

const router = express.Router();

router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order)
        throw new NotFoundError();

    if (order.userId !== req.currentUser!.id)
        throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id!,
        ticket: {
            id: order.ticket.id!,
        }
    });

    res.status(204);
});

export { router as deleteOrderRouter };
