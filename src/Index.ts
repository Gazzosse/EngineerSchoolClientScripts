import { extensionManager } from "@docsvision/webclient/System/ExtensionManager";
import * as ApplicationBusinessTripHandlers from './EventHandlers/ApplicationBusinessTripHandlers';
import { Service } from "@docsvision/web/core/services";
import { $ApplicationBusinessTripService } from "./Services/Interfaces/IApplicationBusinessTripService";
import { ApplicationBusinessTripService } from "./Services/ApplicationBusinessTripService";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";

// Главная входная точка всего расширения
// Данный файл должен импортировать прямо или косвенно все остальные файлы, 
// чтобы rollup смог собрать их все в один бандл.

// Регистрация расширения позволяет корректно установить все
// обработчики событий, сервисы и прочие сущности web-приложения.
extensionManager.registerExtension({
    name: "MyWebExtension",
    version: "1.0",
    globalEventHandlers: [ ApplicationBusinessTripHandlers ],
    layoutServices: [
        Service.fromFactory($ApplicationBusinessTripService, (services: $RequestManager) => new ApplicationBusinessTripService(services)),
    ],
    controls: []
})