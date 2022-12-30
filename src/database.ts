import monk, { ICollection } from 'monk';
import dotenv from 'dotenv';

dotenv.config();

const db = monk(process.env.MONGO_URI ?? '');
db.then(() => {
    console.log('Connected correctly to server');
});
let URLS = new ICollection<any>;

try {
    URLS = db.create('URLS');
} catch (error) {
    URLS = db.get('URLS');
}

URLS.createIndex({"slug": 1}, {unique: true}); // will not create if the index already exists

export const putLink = async (slug: string, URL: string): Promise<any> => {
    try {
        return URLS.insert({slug, URL});
    } catch (error) {
        console.log(error);
    }
}

export const getLink = async (slug: string): Promise<any> => {
    try {
        return URLS.findOne({slug: slug}, { projection: { '_id': 0, 'URL' : 1 } });
    } catch (error) {
        console.log(error);
    }

}

export const validateSlug = async (slug: string): Promise<boolean> => {
    try {
        if (await URLS.count({slug: slug}) === 0) return true;
    } catch (error) {
        console.log(error);
    }
    return false;
}