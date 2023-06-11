import {Matcher} from "../../interfaces";
import {CreateTaskMatcherData} from "./createTask";

export class Simple implements Matcher<CreateTaskMatcherData> {
    name = 'simple';

    isMatching(text: string): boolean {
        return /\d{1,2}\.\d{1,2}\.\d{2,4}, ?\d{1,2}:\d{1,2}, ?.{1,255},? ?.*/.test(text);
    }

    selectData(text: string): CreateTaskMatcherData {
        const [date, time, txt, priority] = text.trim().split(',').filter(s => s.trim())
        const [year, month, day] = this.parseDate(date)
        const [hour, minute] = this.parseTime(time)

        return {
            dateTime: new Date(year, month, day, hour, minute),
            text: txt,
            priority: parseInt(priority),
            repeating: false
        };
    }

    private parseDate(dateStr: string) : [number, number, number] {
        const [day, month, year] = dateStr.split('.')

        return [
            parseInt(year.length < 4 ? `20${year}` : year) ,
            parseInt(month),
            parseInt(day)
        ]
    }

    private parseTime(timeStr: string) : [number, number] {
        const [hour, minute] = timeStr.split(':')

        return [
            parseInt(hour),
            parseInt(minute)
        ]
    }

}