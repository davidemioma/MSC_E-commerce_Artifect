import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export const apiRatelimit = new Ratelimit({
  redis: redis ?? Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});
