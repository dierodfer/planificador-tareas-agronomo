import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Firebase Modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

// Notificaciones Push
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { MessagingService } from './services/messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';

// Cookies
import { CookieService } from 'ngx-cookie-service';

// Componentes 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { MenuComponent } from './components/menu/menu.component';
import { ModalComponent } from './components/modal/modal.component';
import { TaksListComponent } from './components/taks-list/taks-list.component';
import { TaksFormComponent } from './components/taks-form/taks-form.component';
import { DialogIncidentComponent } from './components/dialog-incident/dialog-incident.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { CycleFormComponent } from './components/cycle-form/cycle-form.component';
import { DialogUserComponent } from './components/dialog-user/dialog-user.component';
import { DialogDeleteComponent } from './components/dialog-delete/dialog-delete.component';
import { MenuAdminComponent } from './components/menu-admin/menu-admin.component';

// Material Angular
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatInputModule, MatIconModule} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSelectModule} from '@angular/material/select';
import { ListaDraggableComponent } from './components/lista-draggable/lista-draggable.component';
import {MatSliderModule} from '@angular/material/slider';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NotificationComponent } from './components/notification/notification.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatNativeDateModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTabsModule} from '@angular/material/tabs';




@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserFormComponent,
    MenuComponent,
    ModalComponent,
    ListaDraggableComponent,
    NotificationComponent,
    TaksListComponent,
    TaksFormComponent,
    DialogIncidentComponent,
    HomeComponent,
    LoginComponent,
    GroupListComponent,
    CycleFormComponent,
    DialogUserComponent,
    DialogDeleteComponent,
    MenuAdminComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireMessagingModule,
    AppRoutingModule, FormsModule, ReactiveFormsModule,
    // Material Angular
    BrowserAnimationsModule, MatButtonModule, MatCheckboxModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
    MatSnackBarModule, MatPaginatorModule, MatTableModule,
    MatSortModule, MatDialogModule, MatButtonToggleModule,
    MatChipsModule, DragDropModule, MatSelectModule, MatRadioModule,
    MatSliderModule, MatSidenavModule, MatNativeDateModule, MatCardModule,
    MatDatepickerModule, MatGridListModule, MatExpansionModule, MatTooltipModule,
    MatProgressSpinnerModule, MatListModule, MatBadgeModule, MatTabsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [
    ModalComponent,
    DialogIncidentComponent,
    DialogUserComponent,
    DialogDeleteComponent
  ],
  providers: [MessagingService, AsyncPipe, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
