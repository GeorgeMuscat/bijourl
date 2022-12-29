import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import * as yup from "yup"; // this import is cringe but it does not work unless it is like this :(
import { nanoid } from "nanoid";
import { getLink, putLink, validateSlug } from "./database"
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const port: string = process.env.PORT || '80'

app.use(helmet());
app.use(cors());
app.use(express.json());

const schema = yup.object().shape({
    dest: yup.string().trim().url().required(),
    slug: yup.string().trim(),
});

declare interface PutReturn {
    URL: string,
    slug: string
}

declare interface GetReturn {
    URL: string
}

app.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    let { slug, dest } = req.body;

    try {
        await schema.validate({ dest, slug });
        if (!slug) {
            slug = nanoid(6);
        }

        // Check that slug does not already exist in record.
        if (!await validateSlug(slug)) {
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            res.status(418).json({msg: "The slug provided or generated is invalid, please try again with a different/no slug."})
            return;
        }

        // Record the slug and destination
        const { _id, ...ret } = await putLink(slug, dest);
        const checked: PutReturn = ret;
        res.json(checked);
    } catch (error) {
        next(error);
    }
});

app.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    try {
        const url: GetReturn | void = await getLink(slug);
        if (url) {
            res.redirect(url.URL);
        } else {
            res.status(404).json({msg: "URL does not exist."});
        }
    } catch (error) {
        next(error);
    }
});

app.use("/.well-known/acme-challenge/", express.static('public'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});