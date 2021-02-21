import { STATES } from '../constants/states';
import { Shape } from '../types/shape';
import { IUIState } from './ui-interfaces';

type MatcherItem = {
    match: (text?) => boolean;
    convert: <DATA = unknown>(text?) => DATA;
};

const DEFAULT_MATCHERS = {
    [STATES.PENDING_TASK]: [ {
        match: () => true,
        convert: (text) => text,
    }],
} as Shape<MatcherItem[]>;

interface IMatchedData<DATA> {
    matchers: Shape<MatcherItem[]>;
    convertedData: DATA;

    data(): DATA;
    toString(): string;
}

export function MatcherFactory(matchers: Shape<MatcherItem[]>) {
    return class MatchedDataFromText<DATA = unknown> implements IMatchedData<DATA> {
        matchers: Shape<MatcherItem[]>;
        convertedData: DATA;
        constructor(uiState: IUIState, text: string) {
            this.matchers = matchers;

            const matchersListForUIState = this.matchers[uiState.name];
            const matcherForUIState = matchersListForUIState.find( matcher => matcher.match(text))

            if (matcherForUIState) {
                this.convertedData = matcherForUIState.convert<DATA>(text)
            }
        }

        data() {
            return this.convertedData;
        }

        toString() {
            return this.convertedData.toString();
        }
    }
}
