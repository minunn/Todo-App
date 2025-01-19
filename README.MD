# Todo Application avec Ionic et Angular

## Description

Cette application **Todo** est développée avec **Ionic**, **Angular** et des fonctionnalités natives telles que l'accès à la caméra et l'exportation des tâches en **PDF** et **CSV**. Elle est compatible avec les plateformes **Android** et **Web**.

### Fonctionnalités principales
- **Gestion des Tâches** : Ajouter, éditer, supprimer des tâches.
- **Exportation** : Exporter les tâches en **PDF** ou **CSV**. (Uniquement web)
- **Caméra** : Prendre des photos pour les tâches via l'intégration avec la caméra de l'appareil. (Uniquement sur android)
- **Notifications Locales** : Recevoir des notifications pour les tâches importantes. (Uniquement sur android)
- **Plateformes supportées** : Android et Web.

## Prérequis

Avant d'installer et de lancer l'application, vous aurez besoin des outils suivants :
- **Node.js** et **npm** (gestionnaire de paquets pour JavaScript)
- **Ionic CLI** : Installez-le globalement avec la commande suivante :
  
  ```bash
  npm install -g @ionic/cli
  ```
  
- **Android Studio** et **Xcode** (si vous développez pour Android ou iOS)
  
## Installation

1. Clonez ce repository ou téléchargez les fichiers source.
2. Installez les dépendances nécessaires en exécutant la commande suivante dans votre terminal :
   
   ```bash
   npm install
   ```

3. Lancer l'application en mode développement pour différentes plateformes :
   
   - Pour **Web** :
     
     ```bash
     ionic serve
     ```

   - Pour **Android** (vous devez avoir un émulateur ou un appareil Android connecté) :
     
     ```bash
     ionic cap open android
     ```

## Fonctionnalités détaillées

### 1. Gestion des tâches

L'application permet aux utilisateurs d'ajouter, modifier et supprimer des tâches. 

#### Ajouter une tâche
- Entrez un titre, une description et une date limite pour la tâche.

#### Modifier une tâche
- Modifiez les détails d'une tâche existante en cliquant dessus.

#### Supprimer une tâche
- Supprimez une tâche en appuyant sur l'icône de suppression à côté de la tâche.

### 2. Exportation des tâches

Les utilisateurs peuvent exporter leurs tâches au format **PDF** ou **CSV** en version web.

#### Exporter en PDF
- Les tâches sont exportées dans un fichier PDF formaté en version web.

#### Exporter en CSV
- Les tâches sont exportées dans un fichier CSV compatible avec Excel et autres tableurs en version web.

### 3. Fonctionnalités Caméra

L'application permet aux utilisateurs de prendre des photos et de les associer à des tâches. Cette fonctionnalité utilise le plugin **Capacitor Camera** pour accéder à la caméra de l'appareil et uniquement disponible sur la version android de l'application.

### 4. Notifications Locales

L'application utilise **Capacitor Local Notifications** pour envoyer des rappels pour les tâches à venir. Les notifications sont programmées en fonction de la date limite de la tâche et uniquement disponible sur la version android de l'application.