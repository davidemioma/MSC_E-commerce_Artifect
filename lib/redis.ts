import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const url = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL;

const token = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN;

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
