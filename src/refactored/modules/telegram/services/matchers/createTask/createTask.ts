import {Matcher} from "../../interfaces";
import {MATCHER_NAMES} from "../names";
import {Simple} from "./simple";

export type CreateTaskMatcherData = {
    dateTime: Date;
    text: string;
    priority: number;
    repeating: boolean;
    repeatPattern?: {
        days: string;
        hours: string;
        minutes: string;
    };
}

export class CreateTaskMatcher implements Matcher<CreateTaskMatcherData> {
    name = MATCHER_NAMES.CREATE_TASK;
    private matchers = [new Simple()]
    private matchedName = null

    isMatching(text: string): boolean {
        return this.matchers.some(matcher => matcher.isMatching(text));
    }

    selectData(text: string): CreateTaskMatcherData {
        return this.matchers.find(matcher => matcher.isMatching(text)).selectData(text);
    }

}