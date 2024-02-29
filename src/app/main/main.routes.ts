import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: ContactListComponent },
      {
        path: 'details',
        component: ContactDetailComponent,
      },
      {
        path: 'details/:id',
        component: ContactDetailComponent,
      },
    ],
  },
];
