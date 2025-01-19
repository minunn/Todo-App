import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class TodoService {
  private firestore;
  private localStorageKey = 'todos';

  //Je crée une instance de l'application Firebase et je récupère une référence à la base de données Firestore.
  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.firestore = getFirestore(app);

    //Abonnement aux événements en ligne/hors ligne pour synchroniser les tâches locales avec Firebase.
    fromEvent(window, 'online').subscribe(() => {
      console.log('Le périphérique est en ligne');
      this.syncLocalTasksToFirebase();
    });

    fromEvent(window, 'offline').subscribe(() => {
      console.log('Le périphérique est hors ligne');
    });
  }

  //Je récupère la liste des tâches depuis la base de données Firestore.
  getTasks(): Promise<any[]> {
    if (navigator.onLine) {
      const colRef = collection(this.firestore, 'todos');
      return getDocs(colRef).then((querySnapshot) => {
        const tasks: any[] = [];
        querySnapshot.forEach((docSnapshot) => {
          tasks.push({ ...docSnapshot.data(), id: docSnapshot.id });
        });
        return tasks;
      }).catch((error) => {
        console.error("Une erreur est survenue lors du chargement des tâches:", error);
        return Promise.resolve(this.loadTasksFromLocalStorage());
      });
    } else {
      return Promise.resolve(this.loadTasksFromLocalStorage());
    }
  }

  //Je récupère une tâche spécifique en fonction de son identifiant.
  getTaskById(taskId: string): Promise<any> {
    const docRef = doc(this.firestore, 'todos', taskId);
    return getDoc(docRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        return { ...docSnapshot.data(), id: docSnapshot.id };
      } else {
        throw new Error('La tâche demandée n\'existe pas');
      }
    });
  }

  //Je supprime une tâche en fonction de son identifiant.
  deleteTask(id: string): Promise<any> {
    if (navigator.onLine) {
      const docRef = doc(this.firestore, 'todos', id);
      return deleteDoc(docRef)
        .then(() => {
          console.log('La tâche a été supprimée avec succès');
          this.removeTaskFromLocalStorage(id);
        })
        .catch((error) => {
          console.error('Une erreur est survenue lors de la suppression de la tâche:', error);
        });
    } else {
      this.removeTaskFromLocalStorage(id);
      return Promise.resolve('La tâche a été supprimée avec succès en mode hors ligne');
    }
  }

  //J'ajoute une nouvelle tâche à la base de données Firestore.
  addTask(task: any): Promise<any> {
    if (navigator.onLine) {
      const colRef = collection(this.firestore, 'todos');
      return addDoc(colRef, task).then((docRef) => {
        console.log("Tâche ajoutée avec succès:", docRef.id);
        task.id = docRef.id;
        return this.getTasks();
      });
    } else {
      this.storeTaskLocally(task);
      return Promise.resolve(this.loadTasksFromLocalStorage());
    }
  }
  
  //Je mets à jour une tâche existante en fonction de son identifiant.
  updateTask(id: string, task: any): Promise<any> {
    if (navigator.onLine) {
      const docRef = doc(this.firestore, 'todos', id);
      return setDoc(docRef, task).then(() => {
        console.log('Tâche mise à jour avec succès:', id);
        return this.getTasks();
      });
    } else {
      this.updateLocalTask(id, task);
      return Promise.resolve(this.loadTasksFromLocalStorage());
    }
  }

  //Je synchronise les tâches locales avec Firebase.
  private syncLocalTasksToFirebase() {
    const tasks = this.loadTasksFromLocalStorage();
    tasks.forEach((task) => {
      const colRef = collection(this.firestore, 'todos');
      addDoc(colRef, task)
        .then((docRef) => {
          console.log("Tâche synchronisée avec succès:", docRef.id);
        })
        .catch((error) => {
          console.error("Une erreur est survenue lors de la synchronisation de la tâche:", error);
        });
    });
  }

  //Je stocke une tâche localement dans le stockage local.
  private storeTaskLocally(task: any) {
    let tasks = this.loadTasksFromLocalStorage();
    task.id = task.id || `local-${Date.now()}`;
    tasks.push(task);
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
  }

  //Je charge les tâches depuis le stockage local.
  private loadTasksFromLocalStorage(): any[] {
    const tasks = localStorage.getItem(this.localStorageKey);
    return tasks ? JSON.parse(tasks) : [];
  }

  //Je mets à jour une tâche locale en fonction de son identifiant.
  private updateLocalTask(id: string, updatedTask: any) {
    let tasks = this.loadTasksFromLocalStorage();
    const taskIndex = tasks.findIndex((task: any) => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
      localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    }
  }

  //Je supprime une tâche du stockage local en fonction de son identifiant.
  private removeTaskFromLocalStorage(id: string) {
    let tasks = this.loadTasksFromLocalStorage();
    tasks = tasks.filter((task: any) => task.id !== id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
  }
}