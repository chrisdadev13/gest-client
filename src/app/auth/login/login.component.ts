import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { AuthResponse, AuthService } from '../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HlmInputDirective } from '../../shared/components/ui/ui-input-helm/src/lib/hlm-input.directive';
import { HlmButtonDirective } from '../../shared/components/ui/ui-button-helm/src/lib/hlm-button.directive';
import { HlmLabelDirective } from '../../shared/components/ui/ui-label-helm/src/lib/hlm-label.directive';
import { HlmSpinnerComponent } from '../../shared/components/ui/ui-spinner-helm/src/lib/hlm-spinner.component';
import { HlmAvatarComponent } from '../../shared/components/ui/ui-avatar-helm/src/lib/hlm-avatar.component';
import { HlmAvatarImageDirective } from '../../shared/components/ui/ui-avatar-helm/src/lib/image';
import { HlmAvatarFallbackDirective } from '../../shared/components/ui/ui-avatar-helm/src/lib/fallback';
import { StorageService } from '../../core/services/storage.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  storageService = inject(StorageService);
  errorMessage = '';
  showLoading: boolean = false;
  formBody: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    this.formBody = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ],
      ],
    });
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

    this.authService.login(this.formBody.value).subscribe({
      next: (data: AuthResponse | { [key: string]: any }) => {
        const { id, email, name, refreshToken, accessToken } = data;
        this.storageService.saveUser({ id, email, name });
        this.showLoading = false;
        this.router.navigate(['/main']);

        this.cookieService.set('Authentication', accessToken);
        this.cookieService.set('Refresh', refreshToken);
      },
      error: (errorData) => {
        this.errorMessage = errorData.error.message;
        this.showLoading = false;
      },
    });
  }

  async demoAccount(): Promise<void> {
    this.submitted = true;

    this.showLoading = true;

    this.authService
      .login({
        email: 'demo@gmail.com',
        password: '12345678',
      })
      .subscribe({
        next: (data: AuthResponse | { [key: string]: any }) => {
          const { id, email, name, refreshToken, accessToken } = data;
          this.storageService.saveUser({ id, email, name });
          this.showLoading = false;
          this.router.navigate(['/main']);

          this.cookieService.set('Authentication', accessToken);
          this.cookieService.set('Refresh', refreshToken);
        },
        error: (errorData) => {
          this.errorMessage = errorData.error.message;
          this.showLoading = false;
        },
      });
  }

  onReset(): void {
    this.submitted = false;
    this.formBody.reset();
  }
}
