import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { logger } from '../../logger/logger.js';
let secretManagerClient = null;
const getSecretManagerClient = () => {
    if (!secretManagerClient) {
        logger.debug('Initializing Secret Manager client');
        secretManagerClient = new SecretManagerServiceClient();
    }
    return secretManagerClient;
};
export const getSecretWithEnvCache = async (projectId, secretName) => {
    if (process.env[secretName]) {
        logger.debug(`Secret ${secretName} found in environment variables.`);
        return process.env[secretName];
    }
    const secretValue = await getSecret(projectId, secretName);
    process.env[secretName] = secretValue;
    return secretValue;
};
export const getSecret = async (projectId, secretName, version = "latest") => {
    if (!projectId) {
        throw new Error('Project ID is empty');
    }
    if (!secretName) {
        throw new Error('Secret name is empty');
    }
    const client = getSecretManagerClient();
    const name = `projects/${projectId}/secrets/${secretName}/versions/${version}`;
    try {
        logger.debug(`Accessing secret: ${secretName}`);
        const [version] = await client.accessSecretVersion({ name });
        const payload = version.payload?.data?.toString();
        if (!payload) {
            throw new Error(`Secret ${secretName} is empty or inaccessible.`);
        }
        logger.debug(`Successfully retrieved secret: ${secretName}`);
        return payload;
    }
    catch (error) {
        logger.error(`Error fetching secret ${secretName}`, error);
        throw new Error(`Failed to fetch secret ${secretName}: ${error.message}`);
    }
};
