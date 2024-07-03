import dotenv from 'dotenv';
import { logger } from '../logger/logger.js';
import { } from 'dotenv/config'

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