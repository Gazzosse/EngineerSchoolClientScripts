import { extensionManager } from "@docsvision/webclient/System/ExtensionManager";
import * as ApplicationBusinessTripHandlers from './EventHandlers/ApplicationBusinessTripHandlers';

// Главная входная точка всего расширения
// Данный файл должен импортировать прямо или косвенно все остальные файлы, 
// чтобы rollup смог собрать их все в один бандл.

// Регистрация расширения позволяет корректно установить все
// обработчики событий, сервисы и прочие сущности web-приложения.
extensionManager.registerExtension({
    name: "MyWebExtension",
    version: "1.0",
    globalEventHandlers: [ ApplicationBusinessTripHandlers ],
    layoutServices: [],
    controls: []
})