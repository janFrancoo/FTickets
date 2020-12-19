import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
});

it("returns a 400 with an invalid e-mail", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "asdasdsadasd",
            password: "password"
        })
        .expect(400);
});

it("returns a 400 with an invalid password", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "asdasdsadasd",
            password: "1"
        })
        .expect(400);
});

it("returns a 400 with missing e-mail and password", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com"
        })
        .expect(400);
    
    await request(app)
        .post("/api/users/signup")
        .send({
            password: "123456789"
        })
        .expect(400);
});

it("disallows duplicate e-mails", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400);
});

it("sets a cookie after successful signup", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
    
    expect(response.get("Set-Cookie")).toBeDefined();
});
