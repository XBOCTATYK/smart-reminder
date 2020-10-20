import Markup from 'telegraf/markup';

export function MainMenu() {
    return Markup.keyboard([[
        '+ Добавить',
        '🗒 Список',
    ]]).resize().extra()
}
