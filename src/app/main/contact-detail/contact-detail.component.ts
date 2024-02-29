import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HlmInputDirective } from '../../shared/components/ui/ui-input-helm/src/lib/hlm-input.directive';
import { HlmButtonDirective } from '../../shared/components/ui/ui-button-helm/src/lib/hlm-button.directive';
import { HlmLabelDirective } from '../../shared/components/ui/ui-label-helm/src/lib/hlm-label.directive';
import { HlmSpinnerComponent } from '../../shared/components/ui/ui-spinner-helm/src/lib/hlm-spinner.component';
import { HlmAvatarComponent } from '../../shared/components/ui/ui-avatar-helm/src/lib/hlm-avatar.component';
import { HlmAvatarImageDirective } from '../../shared/components/ui/ui-avatar-helm/src/lib/image';
import { HlmAvatarFallbackDirective } from '../../shared/components/ui/ui-avatar-helm/src/lib/fallback';
import { Router } from '@angular/router';
import {
  ContactService,
  CreateResponse,
} from '../../core/services/contact.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HlmInputDirective,
    HlmButtonDirective,
    HlmLabelDirective,
    HlmSpinnerComponent,
    HlmAvatarComponent,
    HlmAvatarImageDirective,
    HlmAvatarFallbackDirective,
  ],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css',
})
export class ContactDetailComponent {
  contactService = inject(ContactService);
  errorMessage = '';
  showLoading: boolean = false;
  formBody: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    description: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });

  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    const access = this.cookieService.get('Authentication');
    const refresh = this.cookieService.get('Refresh');

    const id = this.router.url.at(-1);

    if (!Number.isNaN(parseInt(id as string)) && id) {
      this.contactService
        .getOne(parseInt(id), access, refresh)
        .subscribe((data) => {
          console.log(data.contact.name);

          this.formBody = this.formBuilder.group({
            name: [data.contact.name, [Validators.required]],
            email: [data.contact.email, [Validators.email]],
            description: [data.contact.description, [Validators.max(150)]],
            phone: [data.contact.phone, []],
            address: [data.contact.address, []],
          });
        });
    } else {
      this.formBody = this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.email]],
        description: ['', [Validators.max(150)]],
        phone: ['', []],
        address: ['', []],
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formBody.controls;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.formBody.invalid) {
      return;
    }

    this.showLoading = true;

    const access = this.cookieService.get('Authentication');
    const refresh = this.cookieService.get('Refresh');

    const id = this.router.url.at(-1);

    if (!Number.isNaN(parseInt(id as string)) && id) {
      this.contactService
        .updateOne(parseInt(id), this.formBody.value, access, refresh)
        .subscribe({
          next: (_data: CreateResponse | { [key: string]: any }) => {
            this.showLoading = false;
            this.router.navigate(['/main']).then(() => {
              window.location.reload();
            });
          },
          error: (errorData) => {
            this.errorMessage = errorData.error.message;
            this.showLoading = false;
          },
        });
    } else {
      this.contactService
        .create(this.formBody.value, access, refresh)
        .subscribe({
          next: (_data: CreateResponse | { [key: string]: any }) => {
            this.showLoading = false;
            this.router.navigate(['/main']).then(() => {
              window.location.reload();
            });
          },
          error: (errorData) => {
            this.errorMessage = errorData.error.message;
            this.showLoading = false;
          },
        });
    }
  }

  onReset(): void {
    this.submitted = false;
    this.formBody.reset();
  }
}
