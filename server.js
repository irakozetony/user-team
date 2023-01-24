import app from "./app";
import dotenv from "dotenv";


dotenv.config();


const PORT = process.env.PORT || 5000;


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
