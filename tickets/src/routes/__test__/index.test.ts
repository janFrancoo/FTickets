import request from "supertest";
import { app } from "../../app";

it("can fetch ticket list", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "title - 1",
            price: 10
        })
        .expect(201);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "title - 2",
            price: 10
        })
        .expect(201);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "title - 3",
            price: 10
        })
        .expect(201);

    const response = await request(app)
        .get("/api/tickets")
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});
