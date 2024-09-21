import { Hono } from "hono";
import rabbitMQConfig from "../config/rabitMq.config";
import PostModel, { Post } from "../models/posts";

(() => rabbitMQConfig.connect())();

const app = new Hono();

app.get("/", async (c) => {
  try {
    const posts: Post[] = await PostModel.find();
    return c.json(
      {
        data: posts,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        error: "Something went wrong",
      },
      500
    );
  }
});

app.post("/", async (c) => {
  try {
    const { title, content } = await c.req.json();
    const newPost = new PostModel({
      title: title,
      content,
    });
    rabbitMQConfig.sendToQueue("posts", JSON.stringify(newPost));
    return c.json(
      {
        status: "queued",
        data: newPost,
      },
      201
    );
  } catch (error) {
    return c.json(
      {
        error: "Something went wrong",
      },
      500
    );
  }
});

export default app;
