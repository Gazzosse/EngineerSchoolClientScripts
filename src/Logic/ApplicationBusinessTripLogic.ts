import { DateTimePicker, DateTimePickerParams } from "@docsvision/webclient/Platform/DateTimePicker";
import { TextArea } from "@docsvision/webclient/Platform/TextArea";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { ILayout } from "@docsvision/webclient/System/$Layout";
import { $MessageBox } from "@docsvision/webclient/System/$MessageBox";
import { Layout } from "@docsvision/webclient/System/Layout";


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
        console.log(newValue);
        console.log(anotherDatePicker.params.value);
        if (!newValue || !anotherDatePicker.params.value) {
            console.warn("Один или оба DatePicker'а не имеют значений");
            return true; // см. выше  
        }
        
        const currentDate = new Date(newValue).setHours(0,0,0,0);
        const anotherDate = new Date(anotherDatePicker.params.value).setHours(0,0,0,0);

        if (isStartDate)
            return currentDate < anotherDate;
        else
            return currentDate > anotherDate;
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
            
            const cardName = nameTextBoxControl.params.value?? "Не указано";
            const creationDate = creationDateControl.params.value? creationDateControl.params.value.toLocaleDateString() : "Не указана";
            const startDate = startDateControl.params.value? startDateControl.params.value.toLocaleDateString() : "Не указана";
            const endDate = endDateControl.params.value? endDateControl.params.value.toLocaleDateString() : "Не указана";
            const reason = reasonTextAreaControl.params.value?? "Не указано";
            
            // Формируем строки для отображения
            const lines = [
                `Название карточки: ${cardName}`,
                `Дата создания: ${creationDate}`,
                `Дата с: ${startDate}`,
                `Дата по: ${endDate}`,
                `Основание для поездки: ${reason}`
            ].join('\n');
            
            await messageBoxSvc.showInfo(lines, "Информация по карточке");
            
        } catch (error) {
            console.error("Ошибка при получении информации о карточке:", error);
            await messageBoxSvc.showError("Не удалось получить информацию по карточке");
        }
    }
}