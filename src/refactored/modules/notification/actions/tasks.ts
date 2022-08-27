import {Action} from "../../common/interfaces/Action";

export const OUTPUT_ACTIONS = {
    SHOW_LIST: 'ACTIONS/SHOW_LIST',
} as const

export const output = {
    showList(list: string[]): Action<string[]> {
        return { type: OUTPUT_ACTIONS.SHOW_LIST, payload: list }
    }
}