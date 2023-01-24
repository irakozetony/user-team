import app from "./app.js";
import dotenv from "dotenv";


dotenv.config();


const PORT = process.env.PORT;


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
