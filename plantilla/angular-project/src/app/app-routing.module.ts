import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TaksListComponent } from './components/taks-list/taks-list.component';
import { TaksFormComponent } from './components/taks-form/taks-form.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { CycleFormComponent } from './components/cycle-form/cycle-form.component';
import { MenuAdminComponent } from './components/menu-admin/menu-admin.component';
import { IncidentsListComponent } from './components/incidents-list/incidents-list.component';

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
          { path: 'admin',
            component: MenuAdminComponent,
            children: [
                  { path: 'incidencias', component: IncidentsListComponent},
                  { path: 'grupos', component: GroupListComponent},
                  { path: 'fases', component: CycleFormComponent},
                ]
          }
        ]
  },
  { path: 'login', component: LoginComponent},
/*   { path: '', redirectTo: '/login', pathMatch: 'full' }, */
  { path: '**', redirectTo: 'login'}
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
