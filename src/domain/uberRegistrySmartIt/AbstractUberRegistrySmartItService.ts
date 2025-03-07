import { injectable } from "inversify";
import { UberRegistrySmartItEntity } from "./UberRegistrySmartItEntity";

@injectable()
export default abstract class AbstractUberRegistrySmartItService {
    abstract getUberRegistryByUserId(userId: string): Promise<UberRegistrySmartItEntity | null>
}