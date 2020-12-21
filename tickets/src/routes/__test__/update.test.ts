import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns 404 if ticket does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "asda",
            price: 20
        })
        .expect(404);
});

it("returns 401 if user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "asda",
            price: 20
        })
        .expect(401);
});

it("returns 401 if user does not own the ticket", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "asda",
            price: 20
        })
        .expect(201);

    const id = response.body.id;

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "asda",
            price: 30
        })
        .expect(401);
});

it("returns 400 if invalid body provided", async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "asda",
            price: 20
        })
        .expect(201);

    const id = response.body.id;

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", cookie)
        .send({
            price: -30
        })
        .expect(400);
});

it("updates the ticket with valid body", async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "asda",
            price: 20
        })
        .expect(201);

    const id = response.body.id;

    const updateResponse = await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", cookie)
        .send({
            title: "asdadadsad",
            price: 100
        })
        .expect(200);

    expect(updateResponse.body.title).toEqual("asdadadsad");
    expect(updateResponse.body.price).toEqual(100);
});
