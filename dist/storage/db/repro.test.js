// Mock logger
const logger = {
    debug: (msg) => console.log(msg)
};
async function test(tracedChatReviewSQL) {
    const threadID = 'some-uuid';
    const symptoms = [{ localThreadId: '1', icdCode: 'A00' }];
    return await tracedChatReviewSQL.begin(async (tr) => {
        await tr `DELETE FROM confirmed_symptoms WHERE local_thread_id = (SELECT id from local_threads WHERE thread_id = ${threadID} LIMIT 1)`;
        if (symptoms?.length) {
            logger.debug(`[Thread ID: ${threadID}] Replacing confirmed symptoms with ${JSON.stringify(symptoms)}`);
            // The error is expected here:
            await tr `INSERT INTO confirmed_symptoms ${tr(symptoms, 'localThreadId', 'icdCode')}`;
        }
    });
}
export {};
