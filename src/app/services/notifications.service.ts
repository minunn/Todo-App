import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';


@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor() { 
        this.initializeLocalNotifications();
    }

    //J'initialise les notifications locales en demandant la permission à l'utilisateur.
    private initializeLocalNotifications() {
        LocalNotifications.requestPermissions().then((result) => {
          if (result.display === 'granted') {
            console.log('La permission de notification locale a été accordée');
          } else {
            console.log('La permission de notification locale a été refusée');
          }
        }).catch((error) => {
          console.error('Une erreur est survenue lors de la demande de permission de notification locale:', error);
        });
      }

      //Je planifie une notification locale pour une tâche donnée.
      async scheduleNotification(taskDeadline: string, taskTitle: string, taskDescription: string) {
        const now = new Date();
        const deadlineDate = new Date(taskDeadline);
      
        if (isNaN(deadlineDate.getTime())) {
          console.error('Date invalide:', taskDeadline);
          return;
        }
      
        console.log('La Notification sera déclenchée à:', deadlineDate);
      
          await LocalNotifications.schedule({
            notifications: [
              {
                id: Math.floor(Math.random() * 1000),
                title: taskTitle,
                body: taskDescription + ' est à faire pour le ' + taskDeadline,
                schedule: { at: new Date(deadlineDate.getTime() + 1000),
                            allowWhileIdle: true
                 },
                 sound: 'default',
              },
            ],
          }).then(() => {
            console.log('La notification a été planifiée avec succès');
          }).catch((error) => {
            console.error('Une erreur est survenue lors de la planification de la notification:', error);
          });
      }
      
      async testPushNotification() {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Math.floor(Math.random() * 1000), 
              title: 'Test de notification push',
              body: 'Wow, cette notification push fonctionne!',
              schedule: { at: new Date(new Date().getTime() + 1000) },
              sound: 'default',
            },
          ],
        });
      }
}