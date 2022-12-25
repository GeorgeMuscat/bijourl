import { IMonkManager, ICollection } from "monk";
import * as monk from 'monk';
import * as dotenv from 'dotenv';

dotenv.config();

const db: IMonkManager = monk.default(process.env.MONGO_URI ?? '');
const URLS: ICollection = db.get('URLS');
URLS.createIndex({"slug": 1}, {unique: true});

export const putLink = async (slug: string, URL: string): Promise<void> => {
    try {
        URLS.insert({slug, URL});
    } catch (error) {
        console.log(error);
    }
}

export const getLink = async (slug: string): Promise<string> => {
    return URLS.findOne({slug: slug}, { projection: { 'URL': 1} });

}