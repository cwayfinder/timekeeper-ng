import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MdButtonModule,
  MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdIconModule, MdListModule, MdSidenavModule, MdToolbarModule
} from '@angular/material';
import { HomeComponent } from './home/home.component';
import { ThingComponent } from './thing/thing.component';
import { ContextComponent } from './context/context.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ThingComponent,
    ContextComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    MdSidenavModule,
    MdToolbarModule,
    MdIconModule,
    MdListModule,
    MdCardModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
