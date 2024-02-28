import { Component } from '@angular/core';
import { HlmButtonDirective } from '../../shared/components/ui/ui-button-helm/src/lib/hlm-button.directive';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HlmButtonDirective],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {}
