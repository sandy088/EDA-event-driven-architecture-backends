import rabbitMQConfig from "../config/rabitmq.config";
import redisConfig from "../config/redis.config";
import PostModel from "../models/posts";

(() => rabbitMQConfig.connect())();


const consumer = async () => {
    await rabbitMQConfig.connect();
    const messages: any[] = [];
  
    //check if the queue exists
    // const queue = await rabbitMQConfig.createQueue("posts");
  
    await rabbitMQConfig.consume("posts", async (message) => {
      messages.push(message);
      //set redis hashes for posts-created
      // await redisConfig.hmapset("posts-created", message.id, JSON.stringify(message));

      console.log("message received: ", message);
    });
  
    setInterval(async () => {
      if (messages.length > 0) {
        try {

          //get all redis hashes for posts-created
          // const messageshashes = await redisConfig.hmapgetall("posts-created");
          // console.log("messages: ", messageshashes);

          await PostModel.insertMany(messages);
          console.log("Bulk insert successful");
          messages.length = 0; // Clear the array after successful insert
        } catch (error) {
          console.error("Bulk insert failed:", error);
        }
      }
    }, 60000); // Adjust the interval as needed (e.g., 60000 ms = 1 minute)
  };
  
//   consumer().catch((error) => {
//     console.error("Failed to start consumer:", error);
//   });

export default consumer;