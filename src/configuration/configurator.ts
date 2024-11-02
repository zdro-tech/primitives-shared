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
    if (!fs.existsSync(secretPath)) {
        logger.error(`Secrets directory not found: ${secretPath}`);
        return;
    }

    logger.debug(`Loading secrets from volume: ${secretPath}`);
    const files = fs.readdirSync(secretPath);

    files.forEach((file) => {
        const filePath = path.join(secretPath, file);
        const key = file.toUpperCase();
        try {
            const value = fs.readFileSync(filePath, 'utf8').trim();
            process.env[key] = value;
            logger.debug(`Loaded secret: ${key} from ${filePath}`);
        } catch (error) {
            logger.error(`Failed to load secret from ${filePath}:`, error);
        }
    });
};