import express from "express"
import uploadRouter from './routes/upload.route.js'
import dotenv from "dotenv"
import cors from "cors"

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
}));
app.use(express.json());
app.use('/upload', uploadRouter);
app.get('/', (req, res) => {
    res.send('HHLD YouTube')
})
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
})