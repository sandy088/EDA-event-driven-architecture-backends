import { createClient, RedisClientType } from "redis";

class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: "redis://localhost:6379",
    });

    this.client.on("error", (err) => {
      console.error("Redis client not connected to the server:", err);
    });

    this.client.on("connect", () => {
      console.log("Redis client connected to the server");
    });

    this.connect();
  }

  private async connect() {
    try {
      await this.client.connect();
    } catch (err) {
      console.error("Error connecting to Redis:", err);
    }
  }

  public async set(key: string, value: string): Promise<void> {
    try {
      await this.client.set(key, value);
    } catch (err) {
      console.error("Error setting value in Redis:", err);
    }
  }

  //set redis hashes for posts-created
  public async hmapset(hashName: string, fieldName: string, value: string) {
    try {
      await this.client.HSET(hashName, fieldName, value);
    } catch (err) {
      console.error("Error setting value in Redis:", err);
    }
  }

  //get redis hashes for posts-created
  public async hmapget(hashName: string, fieldName: string) {
    try {
      return await this.client.HGET(hashName, fieldName);
    } catch (err) {
      console.error("Error setting value in Redis:", err);
    }
  }

  //get all redis hashes for posts-created
  public async hmapgetall(hashName: string) {
    try {
      return await this.client.HGETALL(hashName);
    } catch (err) {
      console.error("Error setting value in Redis:", err);
    }
  }

  //delete redis hashes for posts-created
  public async hmapdel(hashName: string, fieldName: string) {
    try {
      await this.client.HDEL(hashName, fieldName);
    } catch (err) {
      console.error("Error setting value in Redis:", err);
    }
  }

  public async setJson(key: string, value: any, page: number): Promise<void> {
    try {
      await this.client.json.set(`key-${page}`, "$", value);
    } catch (err) {
      console.error("Error setting JSON value in Redis:", err);
    }
  }

  public async getJson(key: string, page: number): Promise<any | null> {
    try {
      return await this.client.json.get(`key-${page}`, {
        path: "$",
      });
    } catch (err) {
      console.error("Error getting JSON value from Redis:", err);
      return null;
    }
  }

  //delete last page from cache
  public async delJson(key: string, page: number): Promise<void> {
    try {
      await this.client.json.del(`key-${page}`);
    } catch (err) {
      console.error("Error deleting JSON value from Redis:", err);
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error("Error getting value from Redis:", err);
      return null;
    }
  }
}

export default new RedisService();
