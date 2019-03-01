import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ListaDraggableComponent } from './components/lista-draggable/lista-draggable.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TaksListComponent } from './components/taks-list/taks-list.component';
import { TaksFormComponent } from './components/taks-form/taks-form.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { CycleFormComponent } from './components/cycle-form/cycle-form.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: HomeComponent,
    children: [
          { path: 'usuarios/formulario', component: UserFormComponent},
          { path: 'usuarios/lista', component: UserListComponent},
          { path: 'tareas/lista', component: TaksListComponent},
          { path: 'tareas/formulario', component: TaksFormComponent},
          { path: 'notificaciones', component: NotificationComponent},
          { path: 'grupos', component: GroupListComponent},
          { path: 'ciclo/formulario', component: CycleFormComponent},
        ]
  },
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
/*   { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found'} */
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
