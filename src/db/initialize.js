import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { addRxPlugin, createRxDatabase, removeRxDatabase } from 'rxdb';
import { urlSchema } from './url.schema';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { ToastContainer, toast } from 'react-toastify';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import { lastOfArray } from 'rxdb';
import { Subject } from 'rxjs';

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);

const initialize = async () => {
    const subs = [];
    const pullStream$ = new Subject();
    // create RxDB
    try {
        const db = await createRxDatabase({
            name: 'jukebox', // <- name
            storage: getRxStorageDexie(),       // <- RxStorage
            password: 'myPassword',             // <- password (optional)
            ignoreDuplicate: true
        });
        db.waitForLeadership().then(() => {
            document.title = '♛ ' + document.title;
        });
        // removeRxDatabase('jukebox', getRxStorageDexie())

        const collections = await db.addCollections({
            urlcollection: {
                schema: urlSchema,
            }
        });
     const pullStream$ = new Subject();
        const urlCollection = collections.urlcollection;

        const replicationState = replicateRxCollection({
            collection: urlCollection,
            replicationIdentifier: 'my-rest-replication-to-http://localhost:3000/api/sync',
            push: {
                /**
                 * Push handler
                 */
                async handler(docs) {
                    /**
                     * Push the local documents to a remote REST server.
                     */
                    const rawResponse = await fetch('http://localhost:3000/api/sync/push', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ docs })
                    });
                    /**
                     * Contains an array with all conflicts that appeared during this push.
                     * If there were no conflicts, return an empty array.
                     */
                    const response = await rawResponse.json();
                    return response;
                },
                /**
                 * Batch size, optional
                 * Defines how many documents will be given to the push handler at once.
                 */
                batchSize: 5,
                /**
                 * Modifies all documents before they are given to the push handler.
                 * Can be used to swap out a custom deleted flag instead of the '_deleted' field.
                 * If the push modifier return null, the document will be skipped and not send to the remote.
                 * Notice that the modifier can be called multiple times and should not contain any side effects.
                 * (optional)
                 */
                modifier: d => d
            },
            pull: {
                /**
                 * Pull handler
                 */
                async handler(lastCheckpoint, batchSize) {
                    const minTimestamp = lastCheckpoint ? lastCheckpoint.updatedAt : 0;
                    /**
                     * In this example we replicate with a remote REST server
                     */
                    const response = await fetch(
                        `http://localhost:3000/api/sync/?minUpdatedAt=${minTimestamp}&limit=${batchSize}`
                    );
                    const documentsFromRemote = await response.json();
                    return {
                        /**
                         * Contains the pulled documents from the remote.
                         * Not that if documentsFromRemote.length < batchSize,
                         * then RxDB assumes that there are no more un-replicated documents
                         * on the backend, so the replication will switch to 'Event observation' mode.
                         */
                        documents: documentsFromRemote,
                        /**
                         * The last checkpoint of the returned documents.
                         * On the next call to the pull handler,
                         * this checkpoint will be passed as 'lastCheckpoint'
                         */
                        checkpoint: documentsFromRemote.length === 0 ? lastCheckpoint : {
                            id: lastOfArray(documentsFromRemote).id,
                            updatedAt: lastOfArray(documentsFromRemote).updatedAt
                        }
                    };
                },
                batchSize: 10,
                /**
                 * Modifies all documents after they have been pulled
                 * but before they are used by RxDB.
                 * Notice that the modifier can be called multiple times and should not contain any side effects.
                 * (optional)
                 */
                modifier: d => d,
                /**
                 * Stream of the backend document writes.
                 * See below.
                 * You only need a stream$ when you have set live=true
                 */
                stream$: pullStream$.asObservable()
            }

        });


    


   
        let firstOpen = true;
        function connectSocket() {
            const socket = new WebSocket('wss://localhost:3000/api/sync/stream');
            /**
             * When the backend sends a new batch of documents+checkpoint,
             * emit it into the stream$.
             * 
             * event.data must look like this
             * {
             *     documents: [
             *        {
             *            id: 'foobar',
             *            _deleted: false,
             *            updatedAt: 1234
             *        }
             *     ],
             *     checkpoint: {
             *         id: 'foobar',
             *         updatedAt: 1234
             *     }
             * }
             */
            socket.onmessage = event => pullStream$.next(event.data);
            /**
             * Automatically reconnect the socket on close and error.
             */
            socket.onclose = () => connectSocket();
            socket.onerror = () => socket.close();

            socket.onopen = () => {
                if (firstOpen) {
                    firstOpen = false;
                } else {
                    /**
                     * When the client is offline and goes online again,
                     * it might have missed out events that happened on the server.
                     * So we have to emit a RESYNC so that the replication goes
                     * into 'Checkpoint iteration' mode until the client is in sync
                     * and then it will go back into 'Event observation' mode again.
                     */
                    pullStream$.next('RESYNC');
                }
            }
        }


        // emits each document that was received from the remote
        replicationState.received$.subscribe(doc => console.dir(doc));

        // emits each document that was send to the remote
        replicationState.sent$.subscribe(doc => console.dir(doc));

        // emits all errors that happen when running the push- & pull-handlers.
        replicationState.error$.subscribe(error => console.dir(error));

        // emits true when the replication was canceled, false when not.
        replicationState.canceled$.subscribe(bool => console.dir(bool));

        // emits true when a replication cycle is running, false when not.
        replicationState.active$.subscribe(bool => console.dir(bool));

        return db;
    } catch (error) {
        console.error(error);
    }
};

export default initialize;