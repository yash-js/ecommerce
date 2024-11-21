import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// create a new redis client
export const redis = new Redis(process.env.UPSTASH_REDIS);