import mongoose, { Connection } from "mongoose";

let instance: Connection | null = null;

async function getMongoConnection(): Promise<Connection> {
    if (!instance) {
        instance = await mongoose.createConnection(process.env.DB_URL ?? "mongodb://root:example@localhost:27017/nf-service?authSource=admin").asPromise();
    }
    return instance;
}

export { getMongoConnection };
