import mongoose from "mongoose";
export const connectWithDB = () => {
  
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(console.log("DB connected successfully"))
    .catch((err) => {
      console.log(err);
      process.on("exit", () => console.log("exiting process"));
      process.exit(1);
    });
};
