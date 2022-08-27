export interface UserSession {
    id: string;
    notificationConfig: {
        from: Date;
        to: Date;
    };
    state: string;
}