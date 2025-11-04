import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { OnSecondedEmployeeFieldChangeResponse } from "../../Model/OnSecondedEmployeeFieldChangeResponse";
import { OnSecondedEmployeeFieldChangeRequest } from "../../Model/OnSecondedEmployeeFieldChangeRequest";
import { SetExpensesResponse } from "../../Model/SetExpensesResponse";
import { SetExpensesRequest } from "../../Model/SetExpensesRequest";

export interface IApplicationBusinessTripService {
    SetFieldsOnSecondedEmployeeFieldChange(model: OnSecondedEmployeeFieldChangeRequest): Promise<OnSecondedEmployeeFieldChangeResponse>
    SetExpenses(model: SetExpensesRequest): Promise<SetExpensesResponse>
}

export type $ApplicationBusinessTripService = { activityPlanService: IApplicationBusinessTripService };
export const $ApplicationBusinessTripService = serviceName<$ApplicationBusinessTripService, IApplicationBusinessTripService>(x => x.activityPlanService);