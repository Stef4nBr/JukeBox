import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { addRxPlugin, createRxDatabase, removeRxDatabase } from 'rxdb';
import { urlSchema } from './url.schema';

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

const initialize = async () => {
    // create RxDB
    try {
        const db = await createRxDatabase({
            name: 'jukebox', // <- name
            storage: getRxStorageDexie(),       // <- RxStorage
            password: 'myPassword',             // <- password (optional)
            ignoreDuplicate: true
        });
   // removeRxDatabase('jukebox', getRxStorageDexie())

        await db.addCollections({
            urlcollection: {
                schema: urlSchema,
    
            }
        });

        return db;
    } catch (error) {
        console.error(error);
    } 
};

export default initialize;