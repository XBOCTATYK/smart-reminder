import { ModelStatic, Model } from 'sequelize';
import { getTasksModel } from 'Models/Tasks';
import { model } from 'Utils/decorators/model';

export class TaskListService {

    private id: number;

    @model('Tasks')
    public TaskModel: ReturnType<typeof getTasksModel>;
    public UserService: any;


    constructor(userId, cached) {
        let taskData = null;

        this.id = userId;

        if (!cached) {
            const dataResult = this.getData(userId)
        }
    }

    private async getData(userId) {
        await this.TaskModel.findAll({ where: { user_id: userId } })
    }
}




export function TaskListCreator(TaskModel, UserService) {
    return function TaskList(userId, cached) {
        const TaskListNew = new TaskListService(userId, cached);

        TaskListNew.TaskModel = TaskModel;
        TaskListNew.UserService = UserService;

        return TaskListNew;
    }
}

