import { NOTIFICATION_ENTITY_KEY, TASK_ENTITY_KEY } from '../constants/enitityNames';
import { TASK_SELECT_ACTION } from '../constants/callback-actions';

export async function taskSelectCallback(ctx, DB) {
    const answer = ctx.update?.callback_query?.data;

    if (!answer) return;

    const [action, taskId] = answer.split('/');

    if (action !== TASK_SELECT_ACTION) return;

    const model = await DB.model(NOTIFICATION_ENTITY_KEY).findOne({
        where: { task_id: taskId, done: false },
        include: [ DB.model(TASK_ENTITY_KEY) ]
    });

    const task = model.Task.dataValues;
    const notify = model.dataValues;

    const message = `
   ***${task.name}***
     
⏱ Время задачи - ${task.time}  
📅 Дата - ${task.date} 
Приоритет - ${task.priority} 
  
↗ ️Время следующего напоминания - ${notify.time} - ${notify.date}  
  
✅ Напоминаний закончено - ${task.notificationsDone}  
↪️ Напоминаний осталось - ${task.notificationsNeed - task.notificationsDone}  

   `;

    await ctx.replyWithMarkdown(message);
}
