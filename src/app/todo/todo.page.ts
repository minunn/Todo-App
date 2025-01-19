import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { Platform } from '@ionic/angular';
import { NotificationService } from '../services/notifications.service';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  todoList: any[] = [];
  isAndroid: boolean = false;

  constructor(
    private todoService: TodoService,
    private notificationService: NotificationService,
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.loadTasks();

    //Je vérifie si l'application est exécutée sur Android
    this.isAndroid = this.platform.is('android');

    //Je m'abonne aux événements de navigation pour rafraîchir la liste des tâches
    this.router.events.subscribe(() => {
      const queryParams = this.router.routerState.snapshot.root.queryParams;
      if (queryParams['refresh']) {
        this.loadTasks();
      }
    });
  }

  //Je charge les tâches depuis le service TodoService
  loadTasks() {
    this.todoService.getTasks().then((tasks) => {
      this.todoList = tasks;
    }).catch((error) => {
      console.error('Une erreur est survenue lors du chargement des tâches:', error);
    });
  }

  //Je redirige l'utilisateur vers le formulaire de modification de la tâche
  editTask(taskId: string) {
    this.router.navigate(['/form', taskId], {
      queryParams: { refresh: true }
    });
  }

  //Je crée une nouvelle tâche et redirige l'utilisateur vers le formulaire de modification
  addTask() {
    const newTask = { 
      title: 'Nouvelle tâche',
      description: 'Description de la tâche', 
      taskDeadline: '2025-01-01', 
      completed: false 
    };

    this.todoService.addTask(newTask).then(() => {
      this.router.navigate(['/todo'], { queryParams: { refresh: true } });
    }).catch((error) => {
      console.error('Une erreur est survenue lors de l\'ajout de la tâche:', error);
    });
  }

  //Je supprime une tâche en utilisant le service TodoService
  deleteTask(taskId: string) {
    this.todoService.deleteTask(taskId).then(() => {
      this.loadTasks();
    }).catch((error) => {
      console.error('Une erreur est survenue lors de la suppression de la tâche:', error);
    });
  }

  //Je bascule l'état de complétion de la tâche
  toggleTaskCompletion(taskId: string) {
    const task = this.todoList.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.todoService.updateTask(taskId, task).then(() => {
        this.loadTasks();
      }).catch((error) => {
        console.error('Une erreur est survenue lors de la mise à jour de la tâche:', error);
      });
    }
  }

  //Je crée un fichier PDF contenant la liste des tâches(uniquement sur la plateforme Web)
  exportToPDF() {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Liste des tâches', 14, 10);

    let yPosition = 20;
    this.todoList.forEach(task => {
      doc.text(`Titre: ${task.title}`, 14, yPosition);
      doc.text(`Description: ${task.description}`, 14, yPosition + 5);
      doc.text(`Date limite: ${task.taskDeadline}`, 14, yPosition + 10);
      yPosition += 15;
    });

    doc.save('tâches.pdf');
  }

  //J'exporte la liste des tâches au format CSV en utilisant la bibliothèque FileSaver.js (uniquement sur la plateforme Web)
  exportToCSV() {
    const csvData = this.todoList.map(task => {
      return {
        Title: task.title,
        Description: task.description,
        Deadline: task.taskDeadline,
      };
    });

    const csvHeaders = ['Titre', 'Description', 'Date limite'];
    const csvRows = csvData.map(row => [row.Title, row.Description, row.Deadline]);

    let csvContent = csvHeaders.join(',') + '\n';
    csvRows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'Tâches.csv');
  }

  //Je teste l'envoi d'une notification push en utilisant le service NotificationService (uniquement sur la plateforme Android)
  testPushNotification() {
    this.notificationService.testPushNotification().then(() => {
      console.log('Test du push notification réussi');
    }).catch((error) => {
      console.error('Erreur lors du test du push notification:', error);
    });
  }
  
}
