import { ILayout } from "@docsvision/webclient/System/$Layout";
import { CancelableEventArgs } from "@docsvision/webclient/System/CancelableEventArgs";
import { ICardSavingEventArgs } from "@docsvision/webclient/System/ICardSavingEventArgs";
import { ApplicationBusinessTripLogic } from "../Logic/ApplicationBusinessTripLogic";
import { DateTimePicker, DateTimePickerParams } from "@docsvision/webclient/Platform/DateTimePicker";
import { IDataChangedEventArgs, IDataChangedEventArgsEx } from "@docsvision/webclient/System/IDataChangedEventArgs";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { StaffDirectoryItems } from "@docsvision/webclient/BackOffice/StaffDirectoryItems";
import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";
import { NumberControl } from "@docsvision/webclient/Platform/Number";


export async function ddApplicationBusinessTrip_beforeCardSaving(layout: ILayout, args: CancelableEventArgs<ICardSavingEventArgs>) {
    if (!layout) { return; }
	let logic = new ApplicationBusinessTripLogic();

    args.wait();
    if (!await logic.checkNameTextBox(layout)) {
        await logic.showTextBoxWarningMessage(layout);
        args.cancel();
        return;
    } 

    args.accept();
}

export async function ddApplicationBusinessTrip_onDateChanged(sender: DateTimePicker, args: IDataChangedEventArgsEx<Date>) {
    if (!sender) { return; }
    let logic = new ApplicationBusinessTripLogic();
    if (!await logic.validateDates(sender, args.newValue)) {
        await logic.showDateWarningMessage(sender.layout);
        return;
    }
    await logic.changeDurationByDates(sender, args.newValue);
}

export async function ddApplicationBusinessTrip_onButtonClicked(sender: CustomButton) {
    if (!sender) { return; }
    let logic = new ApplicationBusinessTripLogic();

    await logic.showCardInfo(sender.layout);
}

export async function ddApplicationBusinessTrip_cityDirectoryDesignerRow_onDataChanged(sender: DirectoryDesignerRow) {
    if (!sender) { return; }
    let logic = new ApplicationBusinessTripLogic();

    await logic.setExpensesByCity(sender);
}

export async function ddApplicationBusinessTrip_staffDirectoryItemsSecondedEmployee_onDataChanged(sender: StaffDirectoryItems, args: IDataChangedEventArgsEx<GenModels.IDirectoryItemData>) {
    if (!sender) { return; }
    let logic = new ApplicationBusinessTripLogic();
    
    await logic.setManagerAndPhone(sender.layout, args.newValue);
}

export async function ddApplicationBusinessTrip_durationNumberControl_onDataChanged(sender: NumberControl, args: IDataChangedEventArgsEx<Number>) {
    if (!sender) { return; }
    let logic = new ApplicationBusinessTripLogic();
    
    await logic.setExpensesByNumberControl(sender.layout, args.newValue);
}