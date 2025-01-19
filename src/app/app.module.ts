import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router'; // Added to import the missing module
import { ReactiveFormsModule } from '@angular/forms'; // Ajouté pour gérer les formulaires

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"todoapp-664aa","appId":"1:340184821410:web:fc19dc91db03a8af9ab1fb","storageBucket":"todoapp-664aa.firebasestorage.app","apiKey":"AIzaSyBg1tGpA1vP7hHKIEjHrX1dDvCF-zkJoAI","authDomain":"todoapp-664aa.firebaseapp.com","messagingSenderId":"340184821410","measurementId":"G-SDL31JG6GW"})), provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}
