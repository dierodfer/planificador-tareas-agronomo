import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ListaDraggableComponent } from './components/lista-draggable/lista-draggable.component';
import { NotificationComponent } from './components/notification/notification.component';

const routes: Routes = [
  { path: 'formulario', component: UserFormComponent},
  { path: 'lista', component: UserListComponent },
  { path: 'listaDraggable', component: ListaDraggableComponent },
  { path: 'notificacion', component: NotificationComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
