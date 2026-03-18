import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Necesario para ngFor, ngIf, ngClass
// En un futuro importarás HttpClientModule aquí

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteListComponent } from './cliente-list.component';
import { KanbanBoardComponent } from './kanban-board.component';

@NgModule({
  declarations: [
    AppComponent,
    ClienteListComponent,
    KanbanBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
