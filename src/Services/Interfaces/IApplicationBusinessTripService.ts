import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { OnSecondedEmployeeFieldChangeResponse } from "../../Model/OnSecondedEmployeeFieldChangeResponse";
import { OnSecondedEmployeeFieldChangeRequest } from "../../Model/OnSecondedEmployeeFieldChangeRequest";
import { SetExpensesResponse } from "../../Model/SetExpensesResponse";
import { SetExpensesRequest } from "../../Model/SetExpensesRequest";
import { GetTicketsCostsRequest } from "../../Model/GetTicketsCostsRequest";
import { GetTicketsCostsResponse } from "../../Model/GetTicketsCostsResponse";

export interface IApplicationBusinessTripService {
    SetFieldsOnSecondedEmployeeFieldChange(model: OnSecondedEmployeeFieldChangeRequest): Promise<OnSecondedEmployeeFieldChangeResponse>
    SetExpenses(model: SetExpensesRequest): Promise<SetExpensesResponse>
    GetTicketsCosts(model: GetTicketsCostsRequest): Promise<GetTicketsCostsResponse>
}

export type $ApplicationBusinessTripService = { activityPlanService: IApplicationBusinessTripService };
export const $ApplicationBusinessTripService = serviceName<$ApplicationBusinessTripService, IApplicationBusinessTripService>(x => x.activityPlanService);