import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const url = process.env.UPSTASH_REDIS_REST_URL as string;

const token = process.env.UPSTASH_REDIS_REST_TOKEN as string;

if (!url || !token) {
  throw new Error(
    "Redis URL or Token is not defined in environment variables."
  );
}

export const redis = new Redis({
  url,
  token,
});

export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});
