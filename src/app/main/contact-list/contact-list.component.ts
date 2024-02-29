import { Component, inject } from '@angular/core';
import {
  lucideArrowUpDown,
  lucideChevronDown,
  lucideMoreHorizontal,
} from '@ng-icons/lucide';
import { provideIcons } from '@ng-icons/core';
import {
  ContactService,
  CreateResponse,
} from '../../core/services/contact.service';
import { CookieService } from 'ngx-cookie-service';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import {
  MatTable,
  MatCell,
  MatHeaderRow,
  MatHeaderCell,
  MatRow,
} from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    MatTable,
    MatRow,
    MatIconButton,
    MatCell,
    MatHeaderCell,
    MatHeaderRow,
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideMoreHorizontal,
      lucideArrowUpDown,
    }),
  ],
  host: {
    class: 'w-full',
  },
})
export class ContactListComponent {
  contacts: CreateResponse[] = [];
  skip = 0;
  take = 10;
  contactService = inject(ContactService);
  errorMessage = '';
  showLoading: boolean = false;

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    this.showLoading = true;

    const access = this.cookieService.get('Authentication');
    const refresh = this.cookieService.get('Refresh');

    this.contactService
      .list({ skip: this.skip, take: this.take }, access, refresh)
      .subscribe({
        next: (data: CreateResponse[] | { [key: string]: any }) => {
          this.showLoading = false;
          this.contacts = data as CreateResponse[];
        },
        error: (errorData) => {
          this.errorMessage = errorData.error.message;
          this.showLoading = false;
        },
      });
  }

  delete(id: number) {
    const access = this.cookieService.get('Authentication');
    const refresh = this.cookieService.get('Refresh');

    this.contactService.deleteContact(id, access, refresh).subscribe(() => {
      this.contactService
        .list({ skip: this.skip, take: this.take }, access, refresh)
        .subscribe({
          next: (data: CreateResponse[] | { [key: string]: any }) => {
            this.showLoading = false;
            this.contacts = data as CreateResponse[];
          },
          error: (errorData) => {
            this.errorMessage = errorData.error.message;
            this.showLoading = false;
          },
        });
    });
  }
}
