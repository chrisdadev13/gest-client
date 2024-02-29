import { Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: ContactListComponent,
  },
];
