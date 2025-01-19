import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { TodoService } from '../services/todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../services/notifications.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  taskTitle: string = '';
  taskDescription: string = '';
  taskDeadline: string = '';
  taskPhoto: string | null = null;
  isAndroid: boolean = false;
  taskId: string | null = null;

  constructor(
    private platform: Platform,
    private todoService: TodoService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  //ici je vérifie si l'application est exécutée sur Android et je récupère l'identifiant de la tâche à modifier.
  ngOnInit() {
    this.isAndroid = this.platform.is('android');
    console.log('Plateforme détectée:', this.isAndroid ? 'Android' : 'Web');
  
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.todoService.getTaskById(this.taskId).then((task) => {
          this.taskTitle = task.title;
          this.taskDescription = task.description;
          this.taskDeadline = task.taskDeadline || new Date().toISOString();
          this.taskPhoto = task.photo || null;
          console.log('Tâche récupérée:', task);
        });
      }
    });
  }
  
  // Je prends une photo avec la caméra du périphérique.
  async takePhoto() {
    if (this.isAndroid) {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      this.taskPhoto = image.dataUrl ?? null;
    } else {
      alert('La prise de photo n\'est pas supportée sur cette plateforme');
    }
  }

  //Ici je crée une nouvelle tâche ou je mets à jour une tâche existante en fonction de l'identifiant de la tâche.
  addOrUpdateTask() {
    const taskData = {
      title: this.taskTitle,
      description: this.taskDescription,
      createdAt: new Date(),
      taskDeadline: this.taskDeadline || new Date().toISOString(),
      photo: this.taskPhoto,
    };

    if (this.taskId) {
      this.todoService.updateTask(this.taskId, taskData)
        .then(() => {
          this.router.navigate(['/todo'], { queryParams: { refresh: true } });
        this.notificationService.scheduleNotification(this.taskDeadline, this.taskTitle, this.taskDescription);
    }).catch((error) => console.error('Une erreur est survenue lors de la mise à jour de la tâche:', error));
    } else {
      this.todoService.addTask(taskData).then(() => {
        this.router.navigate(['/todo'], { queryParams: { refresh: true } });
        this.notificationService.scheduleNotification(this.taskDeadline, this.taskTitle, this.taskDescription);
      }).catch((error) => {
        console.error('Une erreur est survenue lors de l\'ajout de la tâche:', error);
      });
    }
  }

  goBack() {
    this.router.navigate(['/todo']);
  }
}
