import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env");
}

declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

class Singleton {
  private static _instance: Singleton;
  private mongoosePromise: Promise<typeof mongoose>;

  private constructor() {
    this.mongoosePromise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Prevent buffering issues
      dbName: "sitedeals", // Explicitly set database name
    });
    this.mongoosePromise
      .then(() => console.log("MongoDB connected via Mongoose"))
      .catch((err) => console.error("MongoDB connection error:", err));

    if (process.env.NODE_ENV === "development") {
      global._mongoosePromise = this.mongoosePromise;
    }
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Singleton();
    }
    return this._instance.mongoosePromise;
  }
}

const mongoosePromise = Singleton.instance;

export async function connectDB() {
  await mongoosePromise;
  return mongoose.connection; // Return Mongoose connection for compatibility
}

export default mongoosePromise;
