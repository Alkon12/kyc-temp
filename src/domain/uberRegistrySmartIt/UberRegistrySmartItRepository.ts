import { UberRegistrySmartItEntity } from "./UberRegistrySmartItEntity";

export default interface UberRegistrySmartItRepository {
    getUberRegistryByUserId(userId: string): Promise<UberRegistrySmartItEntity | null>
}