import dotenv from 'dotenv';
import { logger } from '../logger/logger.js';
import { } from 'dotenv/config'
import fs from 'fs';
import path from 'path';

const DEFAULT_SECRET_PATH = '/secrets';

export const loadConfigurations = (configPaths = ['./.shared.env']) => {
    if (!process.env.VARIABLES_CONFIG_PATH) {
        configPaths.push('./.local.env');
    } else {
        configPaths.push(`./.${process.env.VARIABLES_CONFIG_PATH}.env`);
    }
    logger.debug("Loading config files", configPaths);
    for (const configFile of configPaths) {
        dotenv.config({ path: configFile, override: true });
    }
    logger.debug("Config files loaded: " + JSON.stringify(process.env, null, 2));
}
export const loadSecretsFromVolumes = (secretPath: string = DEFAULT_SECRET_PATH): void => {
    const loadSecrets = (currentPath: string): void => {
        if (!fs.existsSync(currentPath)) {
            logger.error(`Secrets directory not found: ${currentPath}`);
            return;
        }

        const items = fs.readdirSync(currentPath);
        items.forEach((item) => {
            const itemPath = path.join(currentPath, item);
            const key = item.toUpperCase();

            try {
                if (fs.lstatSync(itemPath).isDirectory()) {
                    loadSecrets(itemPath);
                } else {
                    const value = fs.readFileSync(itemPath, 'utf8').trim();
                    process.env[key] = value;
                    logger.debug(`Loaded secret: ${key} from ${itemPath}`);
                }
            } catch (error) {
                logger.error(`Failed to load secret from ${itemPath}:`, error);
            }
        });
    };

    logger.debug(`Loading secrets from volume: ${secretPath}`);
    loadSecrets(secretPath);
};
