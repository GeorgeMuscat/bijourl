import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import * as yup from "yup";
import { nanoid } from "nanoid";
// import { getLink, putLink } from "./database"

const app: Application = express();
const port: Number = 9000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const schema = yup.object().shape({
    dest: yup.string().trim().url().required(),
    slug: yup.string().trim(),
});

app.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    let { slug, dest } = req.body;

    try {
        await schema.validate({ dest, slug });
        if (!slug) {
            slug = nanoid(6);
        }

        // Record the slug and destination
        // putLink(slug, dest);
        res.json({ slug, dest });
    } catch (error) {
        next(error);
    }
});

app.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    try {
        const url = "https://google.com/";//await getLink(slug);
        if (url) {
            res.redirect(url);
        } else {
            res.status(404).json({msg: "URL does not exist."});
        }
    } catch (error) {
        next(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});