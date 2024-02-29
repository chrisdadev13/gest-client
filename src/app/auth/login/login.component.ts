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
import { StorageService } from '../../core/services/storage.service';
import { Router } from '@angular/router';

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
        const { id, email } = data;
        this.storageService.saveUser({ id, email });
        this.showLoading = false;
        this.router.navigate(['/home']);
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
