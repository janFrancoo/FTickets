import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError, requireAuth, NotFoundError, NotAuthorizedError, OrderStatus } from "@francofrancos/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publishers/payment_created_publisher";
import { natsWrapper } from "../nats_wrapper";

const router = express.Router();

router.post("/api/payments", requireAuth, [
    body("token")
        .not()
        .isEmpty(),
    body("orderId")
        .not()
        .isEmpty()
], async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order)
        throw new NotFoundError();

    if (order.userId !== req.currentUser!.id)
        throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancelled)
        throw new BadRequestError("Order is already expired or cancelled");

    const charge = await stripe.charges.create({
        currency: "usd",
        amount: order.price * 100,
        source: token
    });

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        orderId: orderId,
        stripeId: charge.id
    });

    res.status(201).send({ success: true });
});

export { router as createChargeRouter };
