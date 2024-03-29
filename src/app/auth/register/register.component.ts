import { Component, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authService = inject(AuthService);
  storageService = inject(StorageService);
  errorMessage = '';
  showLoading: boolean = false;
  formBody: FormGroup = new FormGroup({
    email: new FormGroup(''),
    name: new FormGroup(''),
    password: new FormGroup(''),
  });

  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.formBody = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
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

    this.authService.register(this.formBody.value).subscribe({
      next: (data: AuthResponse | { [key: string]: any }) => {
        const { id, email, name } = data;
        this.storageService.saveUser({ id, email, name });
        this.showLoading = false;
        this.router.navigate(['/main']);
      },
      error: (errorData) => {
        if (errorData.error.message === 'UserAlreadyExists') {
          this.errorMessage = 'The email provided is already taken';
        } else {
          this.errorMessage = errorData.error.message;
        }
        this.showLoading = false;
      },
    });
  }

  onReset(): void {
    this.submitted = false;
    this.formBody.reset();
  }
}
