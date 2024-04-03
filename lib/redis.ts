import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = new Redis({
  url: "https://firm-macaw-48172.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});
