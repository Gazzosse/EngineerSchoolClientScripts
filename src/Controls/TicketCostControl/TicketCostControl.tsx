import { BasicApiEvent } from "@docsvision/webclient/System/ApiEvent";
import { BaseControl, BaseControlParams, BaseControlState } from "@docsvision/webclient/System/BaseControl";
import { ControlImpl } from "@docsvision/webclient/System/ControlImpl";
import { apiEvent } from "@docsvision/webclient/System/Event";
import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { $CardId } from "@docsvision/webclient/System/LayoutServices";
import { r } from "@docsvision/webclient/System/Readonly";
import { rw } from "@docsvision/webclient/System/Readwrite";
import React from "react";
import { $ApplicationBusinessTripService } from "../../Services/Interfaces/IApplicationBusinessTripService";
import { GetTicketsCostsResponse } from "../../Model/GetTicketsCostsResponse";
import { Button, ButtonAlignModes } from "@docsvision/webclient/Helpers/Button";
import { ILayout } from "@docsvision/webclient/System/$Layout";
import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { $MessageBox } from "@docsvision/webclient/System/$MessageBox";
import { GetTicketsCostsRequest } from "../../Model/GetTicketsCostsRequest";
import { DropdownButton, IDropdownButtonListItem } from "@docsvision/webclient/Helpers/DropdownButton";
import { DropdownButtonView } from "@docsvision/webclient/Helpers/DropdownButton/DropdownButtonView";

export class TicketCostControlParams extends BaseControlParams {
    @r ticketCostButton?: string;
    @r ticketCostDropdown?: string;
    @r ticketCostLabel?: string;

    @r services?: $ApplicationBusinessTripService;
}

export interface TicketCostControlState extends TicketCostControlParams, BaseControlState {
     flights: IDropdownButtonListItem[];
     totalCost: number;
     isDropdownOpened: boolean;
}



export class TicketCostControl extends BaseControl<TicketCostControlParams, TicketCostControlState> {

    protected construct(): void {
        super.construct();
        this.state.flights = null;
        this.state.totalCost = null;
        this.state.isDropdownOpened = false;
    }

    protected createParams() {
        return new TicketCostControlParams();
    }

    protected createImpl() { 
        return new ControlImpl(this.props, this.state, this.renderControl.bind(this));
    }

    private async onButtonClick() {
        const cityControl = this.layout.controls.tryGet<DirectoryDesignerRow>("cityDirectoryDesignerRow");
        const startDateControl = this.layout.controls.tryGet<DateTimePicker>("startDateTimePicker");
        const endDateControl = this.layout.controls.tryGet<DateTimePicker>("endDateTimePicker");

        if (!cityControl || !startDateControl || !endDateControl) {
            this.layout.getService($MessageBox).showWarning("Отсутствуют необходимые контролы");
        }
        if (cityControl.value.id == '00000000-0000-0000-0000-000000000000') {
            this.layout.getService($MessageBox).showWarning("Заполните поле города командировки");
            return;
        }
            
        if (!startDateControl.value || !endDateControl.value) {
            this.layout.getService($MessageBox).showWarning("Заполните поля дат командировки");
            return;
        }
        
        const request: GetTicketsCostsRequest = {
            cityId: cityControl.value.id,
            departureDate: startDateControl.value,
            returnDate: endDateControl.value
        }; 
        const response = await this.params.services.activityPlanService.GetTicketsCosts(request);
        const tempFlightsList: IDropdownButtonListItem[] = [];
        response.flights.forEach((flight, index) => {
            tempFlightsList.push({
                key: index.toString(),
                content: `${flight.airline} ${flight.flightNumber} - ${flight.price} руб.`,
                onClick: () => this.onDropdownItemClick(flight.price)
            });
        })
        this.setState( {
            flights: tempFlightsList
        });
        console.log(this.state.flights);
    }

    private onDropdownItemClick = (price: number) => {
    this.setState({
        totalCost: price,
        isDropdownOpened: false
    });
}

    renderControl() { 
        return (
            <div className="block-with-my-styles">
                <div className="ticket-content">
                    <Button 
                        text={this.params.ticketCostButton} 
                        align={ButtonAlignModes.Center} 
                        onClick={() => this.onButtonClick()}
                        className="ticket-button"
                    />
                    {this.state.flights != null && (
                        <div>
                            <DropdownButton 
                                buttonText={this.params.ticketCostDropdown} 
                                list={this.state.flights} 
                                isOpen={this.state.isDropdownOpened} 
                                onCloseList={() => {
                                    this.setState( {
                                        isDropdownOpened: false
                                    });
                                }} 
                                onToggleList={() => {
                                    this.setState( {
                                        isDropdownOpened: !this.state.isDropdownOpened
                                    });
                                }}
                                className="ticket-dropdown"
                            />
                            <div className="ticket-cost-display">
                                {this.params.ticketCostLabel}
                                {this.state.totalCost != null && ` ${this.state.totalCost} руб.`}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
