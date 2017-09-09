import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdIconModule, MdInputModule, MdListModule,
  MdSelectModule,
  MdSidenavModule,
  MdToolbarModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ThingComponent } from './thing/thing.component';
import { ContextComponent } from './context/context.component';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './firebase.config';
import { ActivityComponent } from './activity/activity.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './auth.guard';
import { ProjectComponent } from './project/project.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ThingComponent,
    ContextComponent,
    ActivityComponent,
    LoginComponent,
    LayoutComponent,
    ProjectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    AppRoutingModule,

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

    MdSidenavModule,
    MdToolbarModule,
    MdIconModule,
    MdListModule,
    MdCardModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCheckboxModule,
    MdSelectModule,
    MdInputModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
