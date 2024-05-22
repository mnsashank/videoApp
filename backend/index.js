import express from "express"
import uploadRouter from './routers/upload.route.js'
import multipartuploadRouter from './routers/multipartupload.route.js'
import dotenv from "dotenv"
import cors from "cors"

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
console.log(process.env.PORT)
app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
}));

app.use(express.json());
app.use('/upload', uploadRouter);

app.use('/multipartupload', multipartuploadRouter);

app.get('/', (req, res) => {
    res.send('HHLD YouTube')
})

app.listen(port, () => {
console.log(`Server is listening at http://localhost:${port}`);
})