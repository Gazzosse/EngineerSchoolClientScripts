import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";
import { $EmployeeController } from "@docsvision/webclient/Generated/DocsVision.WebClient.Controllers";
import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { DateTimePicker, DateTimePickerParams } from "@docsvision/webclient/Platform/DateTimePicker";
import { TextArea } from "@docsvision/webclient/Platform/TextArea";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { ILayout } from "@docsvision/webclient/System/$Layout";
import { $MessageBox } from "@docsvision/webclient/System/$MessageBox";
import { Layout } from "@docsvision/webclient/System/Layout";
import { $CardId } from "@docsvision/webclient/System/LayoutServices";
import { $ApplicationBusinessTripService } from "../Services/Interfaces/IApplicationBusinessTripService";
import { StaffDirectoryItems } from "@docsvision/webclient/BackOffice/StaffDirectoryItems";
import { OnSecondedEmployeeFieldChangeRequest } from "../Model/OnSecondedEmployeeFieldChangeRequest";
import { NumberControl } from "@docsvision/webclient/Platform/Number";
import { SetExpensesRequest } from "../Model/SetExpensesRequest";


export class ApplicationBusinessTripLogic {
    public async checkNameTextBox(layout:ILayout): Promise<boolean> {
        const textControl = layout.controls.tryGet<TextBox>("nameTextBox");
        if (!textControl || !textControl.params.value || textControl.params.value.trim() === "")
            return false;
        return true;
    }

    public async showTextBoxWarningMessage(layout:ILayout) {
        await layout.getService($MessageBox).showWarning('Элемент управления nameTextBox не заполнен!');
        return;
    }

    public async validateDates(sender: DateTimePicker, newValue: Date): Promise<boolean> {
        
        const isStartDate = sender.params.name === "startDateTimePicker";
        const anotherDatePicker = sender.layout.controls.tryGet<DateTimePicker>(isStartDate ? "endDateTimePicker" : "startDateTimePicker");
        if (!anotherDatePicker) {
            console.warn("Нет второго DatePicker");
            return true; // возвращается true, так как проверяется только разница в значениях контролов, а не их пустота
        }
        if (!newValue || !anotherDatePicker.params.value) {
            console.warn("Один или оба DatePicker'а не имеют значений");
            return true; // см. выше  
        }
        
        const currentDate = new Date(newValue).setHours(0,0,0,0);
        const anotherDate = new Date(anotherDatePicker.params.value).setHours(0,0,0,0);

        if (isStartDate)
            return currentDate <= anotherDate;
        else
            return currentDate >= anotherDate;
    }

    public async showDateWarningMessage(layout:ILayout) {
        await layout.getService($MessageBox).showWarning("Дата 'По' должна быть больше даты 'С'!");
        return;
    }

    public async showCardInfo(layout: ILayout) {
        const messageBoxSvc = layout.getService($MessageBox);
        try {
            
            
            const nameTextBoxControl = layout.controls.tryGet<TextBox>("nameTextBox");
            const creationDateControl = layout.controls.tryGet<DateTimePicker>("creationDateTimePicker");
            const startDateControl = layout.controls.tryGet<DateTimePicker>("startDateTimePicker");
            const endDateControl = layout.controls.tryGet<DateTimePicker>("endDateTimePicker");
            const reasonTextAreaControl = layout.controls.tryGet<TextArea>("reasonTextArea");
            const cityControl = layout.controls.tryGet<DirectoryDesignerRow>("cityDirectoryDesignerRow");
            
            const cardName = nameTextBoxControl.params.value?? "Не указано";
            const creationDate = creationDateControl.params.value? creationDateControl.params.value.toLocaleDateString() : "Не указана";
            const startDate = startDateControl.params.value? startDateControl.params.value.toLocaleDateString() : "Не указана";
            const endDate = endDateControl.params.value? endDateControl.params.value.toLocaleDateString() : "Не указана";
            const reason = reasonTextAreaControl.params.value?? "Не указано";
            const city = cityControl.params.value? cityControl.params.value.name : "Не указан";
            // Формируем строки для отображения
            const lines = [
                `Название карточки: ${cardName}`,
                `Дата создания: ${creationDate}`,
                `Дата с: ${startDate}`,
                `Дата по: ${endDate}`,
                `Основание для поездки: ${reason}`,
                `Город: ${city}`
            ].join('\n');
            
            await messageBoxSvc.showInfo(lines, "Информация по карточке");
            
        } catch (error) {
            console.error("Ошибка при получении информации о карточке:", error);
            await messageBoxSvc.showError("Не удалось получить информацию по карточке");
        }
    }

    public async setManagerAndPhone(layout:ILayout, itemData:GenModels.IDirectoryItemData) {
        console.log("Зашли в логику");
        if (!itemData) { console.log("Вышли из логики, itemdata null"); return; }
        const messageBoxSvc = layout.getService($MessageBox);
        if (itemData.dataType !== GenModels.DirectoryDataType.Employee) {
            await messageBoxSvc.showError("Неверный тип объекта");
            console.log(itemData);
        }
        const employeeModel = await layout.getService($EmployeeController).getEmployee(itemData.id);
        console.log(employeeModel.id);
        if (employeeModel) {
            const request: OnSecondedEmployeeFieldChangeRequest = {
                employeeId: employeeModel.id
            };      
            const response = await layout.getService($ApplicationBusinessTripService).SetFieldsOnSecondedEmployeeFieldChange(request);
            const managerControl = layout.controls.tryGet<StaffDirectoryItems>("managerStaffDirectoryItems");
            const workPhoneControl = layout.controls.tryGet<TextBox>("workPhoneTextBox");

            console.log(response.managerId);
            console.log(response.workPhoneNumber);

            managerControl.params.value = await layout.getService($EmployeeController).getEmployee(response.managerId);
            workPhoneControl.params.value = response.workPhoneNumber;
        }
        else {
            console.log("Неудачно закончили логику");
        }
    }

    public async changeDurationByDates(sender: DateTimePicker, newValue: Date) {
        
        const isStartDate = sender.params.name === "startDateTimePicker";
        const anotherDatePicker = sender.layout.controls.tryGet<DateTimePicker>(isStartDate ? "endDateTimePicker" : "startDateTimePicker");
        if (!anotherDatePicker) {
            console.warn("Нет второго DatePicker");
            return true; // возвращается true, так как проверяется только разница в значениях контролов, а не их пустота
        }
        if (!newValue || !anotherDatePicker.params.value) {
            console.warn("Один или оба DatePicker'а не имеют значений");
            return true; // см. выше  
        }

        const currentDate = new Date(newValue).getTime();
        const anotherDate = new Date(anotherDatePicker.params.value).getTime();
        let diffTime = 0;
        if (isStartDate) {
            diffTime = anotherDate - currentDate;
        }
        else {
            diffTime = currentDate - anotherDate;
        }
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const durationNumberControl = sender.layout.controls.tryGet<NumberControl>("durationNumber");
        if (durationNumberControl)
            durationNumberControl.params.value = diffDays;
    }

    public async setExpensesByCity(sender: DirectoryDesignerRow) {
        console.log("Зашли в логику");
        if (!sender.params.value) { console.log("Вышли из логики, sender null"); return; }
        const durationNumberControl = sender.layout.controls.tryGet<NumberControl>("durationNumber");
        if (durationNumberControl && durationNumberControl.params.value) {
            await this.setExpenses(sender.layout, sender.params.value.name, durationNumberControl.params.value);
        }
        else { 
            console.log("Вышли из логики, number null"); 
            return; 
        }
    }

    public async setExpensesByNumberControl(layout:ILayout, newNumber: Number) {
        console.log("Зашли в логику");
        if (!newNumber) { return; }
        const cityControl = layout.controls.tryGet<DirectoryDesignerRow>("cityDirectoryDesignerRow");
        if (cityControl && cityControl.params.value) {
            await this.setExpenses(layout, cityControl.params.value.name, newNumber.valueOf());
        }
        else { 
            console.log("Вышли из логики, city null"); 
            return; 
        }
    }

    public async setExpenses(layout:ILayout, cityName: string, duration: number) {
        console.log(cityName);
        console.log(duration);
        if (cityName && duration) {
            const request: SetExpensesRequest = {
                cityName: cityName,
                duration: duration
            };      
            const response = await layout.getService($ApplicationBusinessTripService).SetExpenses(request);
            console.log(response.expenses);
            const sumControl = layout.controls.tryGet<NumberControl>("sumNumber");
            if (!sumControl) { console.log("Вышли из логики, sum null"); return; }
            sumControl.params.value = response.expenses;
        }
        else { return; }
    }
}