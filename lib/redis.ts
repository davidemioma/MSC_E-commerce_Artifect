import Redis from "ioredis";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis as RedisClient } from "@upstash/redis";

export const redis = new RedisClient({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export const apiRatelimit = new Ratelimit({
  redis: redis ?? RedisClient.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL as string;
  }

  throw new Error("Redis URL not specified!");
};

export const redisServer = new Redis(getRedisUrl());
