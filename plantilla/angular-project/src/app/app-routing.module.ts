import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ListaDraggableComponent } from './components/lista-draggable/lista-draggable.component';
import { NotificationComponent } from './components/notification/notification.component';
import { HistoricComponent } from './components/historic/historic.component';
import { TaksListComponent } from './components/taks-list/taks-list.component';
import { TaksFormComponent } from './components/taks-form/taks-form.component';

const routes: Routes = [
  { path: 'usuarios/formulario', component: UserFormComponent},
  { path: 'usuarios/lista', component: UserListComponent },
/*   { path: 'listaDraggable', component: ListaDraggableComponent }, */
  { path: 'tareas/lista', component: TaksListComponent },
  { path: 'tareas/formulario', component: TaksFormComponent },
  { path: 'notificaciones', component: NotificationComponent },
  { path: 'tareas/historico', component: HistoricComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
