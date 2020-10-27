import Markup from 'telegraf/markup';
import { TEXT_COMMANDS } from 'Constants/textCommands';

export function MainMenu() {
    return Markup.keyboard([[
        TEXT_COMMANDS.ADD,
        TEXT_COMMANDS.LIST,
    ]]).resize().extra()
}
