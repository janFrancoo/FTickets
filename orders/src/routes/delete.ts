import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { OrderStatus, requireAuth } from "@francofrancos/common";

const router = express.Router();

router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    
});

export { router as deleteOrderRouter };
