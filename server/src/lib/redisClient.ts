import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err)=> console.error("Redis client error: ", err));

(async ()=>{
    try{
        await redisClient.connect();
        console.log("Conenction to redis success");
    }catch(err){
        console.error("Redis connection error: ", err);
    }
})();

export default redisClient;

