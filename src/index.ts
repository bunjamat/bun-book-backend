import { Elysia } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { createBook, deleteBook, getBook, getBooks, updateBook } from "./model";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Books Search documentation",
          version: "0.1.0",
        },
      },
    })
  )
  .use(
    staticPlugin({
      prefix: "/files",
    })
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .use(
    cors({
      origin: "*",
      methods: "GET,PUT,POST,DELETE",
      allowedHeaders: ["Authorization", "Content-Type"],
    })
  )
  .use(bearer())
  .get("/", () => "Hello Elysia")
  .get("/books", () => getBooks())
  .get("/books/:id", ({ params }) => {
    return getBook(parseInt(params.id));
  })

  .post("/books", ({ body }) => {
    return createBook(body);
  })
  .put("/books/:id", async ({ body, params }) => {
    const dataBook: any = body;
    return await updateBook({ ...dataBook, id: parseInt(params.id) });
  })
  .delete("/books/:id", ({ params }) => {
    return deleteBook(parseInt(params.id));
  })

  /* user -------------------- */
  .post("/login", ({ body }) => {
    // const { username, password } = body;
    return { token: "token" };
  })
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
