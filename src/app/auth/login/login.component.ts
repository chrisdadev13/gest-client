import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HlmInputDirective } from '../../shared/components/ui/ui-input-helm/src/lib/hlm-input.directive';
import { HlmButtonDirective } from '../../shared/components/ui/ui-button-helm/src/lib/hlm-button.directive';
import { HlmLabelDirective } from '../../shared/components/ui/ui-label-helm/src/lib/hlm-label.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HlmInputDirective,
    HlmButtonDirective,
    HlmLabelDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  formBody: FormGroup = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    password: new FormControl(''),
  });

  submitted = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formBody = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],

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

    await this.authService.login(this.formBody.value);
  }

  onReset(): void {
    this.submitted = false;
    this.formBody.reset();
  }
}
