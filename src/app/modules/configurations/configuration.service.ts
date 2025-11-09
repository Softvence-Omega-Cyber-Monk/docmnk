import { Iconfiguration } from "./configuration.interface";
import { configurationModel } from "./configuration.model";


const createConfiguration = async (payload: Iconfiguration) => {
    const configuration = await configurationModel.create(payload);
    return configuration;
}

export const configurationService = {
    createConfiguration,
}