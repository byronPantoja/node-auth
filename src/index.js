import "./env.js";
import { fastify } from "fastify";
import fastifyStatic from "fastify-static";
import fastifyCookie from "fastify-cookie";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import { signUpUser } from "./accounts/signup.js";
import { signInUser } from "./accounts/signin.js";

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE,
    });

    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    app.post("/api/signup", {}, async (request, reply) => {
      try {
        const userId = await signUpUser(
          request.body.email,
          request.body.password
        );
      } catch (e) {
        console.error(e);
      }
    });

    app.post("/api/signin", {}, async (request, reply) => {
      try {
        console.log(request.body.email, request.body.password);
        const userId = await signInUser(
          request.body.email,
          request.body.password
        );

        // generate auth cookies

        //set cookies
        reply
          .setCookie("testCookie", "the value is this", {
            path: "/",
            domain: "localhost",
            httpOnly: true,
          })
          .send({
            data: "just testing",
          });
      } catch (e) {
        console.error(e);
      }
    });

    app.get("/test", {}, (request, reply) => {
      console.log(request.cookies.testCookie);
      reply.send({
        data: "hello world",
      });
    });

    await app.listen(3000);
    console.log("Server is listening on port: 3000");
  } catch (e) {
    console.error(e);
  }
}

connectDb().then(() => {
  startApp();
});
