import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

class NotificationService {
    constructor() {
        this.configure();
    }

    configure = async () => {
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
            alert('You need to grant permissions')
            return;
        }
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true
            })
        })
    }

    scheduleNotifications = async (date: any, message: string) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Alarm',
                body: message,
                sound: true,
            },
            trigger: {
                date: date,
            },
        })
    }
}

export default new NotificationService()