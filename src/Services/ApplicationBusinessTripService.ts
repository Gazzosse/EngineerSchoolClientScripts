import { ControllerBase, HttpMethods } from "@docsvision/webclient/System/ControllerBase";
import { IApplicationBusinessTripService } from "./Interfaces/IApplicationBusinessTripService";
import { OnSecondedEmployeeFieldChangeResponse } from "../Model/OnSecondedEmployeeFieldChangeResponse";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { OnSecondedEmployeeFieldChangeRequest } from "../Model/OnSecondedEmployeeFieldChangeRequest";
import { SetExpensesRequest } from "../Model/SetExpensesRequest";
import { SetExpensesResponse } from "../Model/SetExpensesResponse";

export class ApplicationBusinessTripService extends ControllerBase implements IApplicationBusinessTripService {
    
    protected controllerName: string = "ApplicationBusinessTrip";

    constructor(protected services: $RequestManager) {
        super(services);
    }

    SetFieldsOnSecondedEmployeeFieldChange(model: OnSecondedEmployeeFieldChangeRequest): Promise<OnSecondedEmployeeFieldChangeResponse> {
        return super.doRequest({
            controller: this.controllerName,
            action: "SetFieldsOnSecondedEmployeeFieldChange",
            isApi: false,
            method: HttpMethods.Post,
            data: model,
            options: { isShowOverlay: true },
        });
    }

    SetExpenses(model: SetExpensesRequest): Promise<SetExpensesResponse> {
        return super.doRequest({
            controller: this.controllerName,
            action: "SetExpenses",
            isApi: false,
            method: HttpMethods.Post,
            data: model,
            options: { isShowOverlay: true },
        });
    }
}
