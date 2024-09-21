import { Hono } from "hono";
import consumer from "./lib/post.consumer";
import { connect } from "./config/db.config";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

connect();

consumer().catch((error) => {
  console.error("Failed to start consumer:", error);
});

export default {
  port: 3001,
  fetch: app.fetch,
};
