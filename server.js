import app from "./app";
import dotenv from "dotenv";
import { connectDb } from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
    await connectDb();
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
})();
