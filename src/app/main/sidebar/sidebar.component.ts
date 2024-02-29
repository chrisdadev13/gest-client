import { Component, inject } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import { HlmAvatarComponent } from '../../shared/components/ui/ui-avatar-helm/src/lib/hlm-avatar.component';
import { HlmAvatarImageDirective } from '../../shared/components/ui/ui-avatar-helm/src/lib/image';
import { HlmAvatarFallbackDirective } from '../../shared/components/ui/ui-avatar-helm/src/lib/fallback';
import { HlmButtonDirective } from '../../shared/components/ui/ui-button-helm/src/lib/hlm-button.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmAvatarComponent,
    HlmAvatarImageDirective,
    HlmAvatarFallbackDirective,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  user: string | undefined;
  userEmail: string | undefined;
  storageService = inject(StorageService);

  ngOnInit(): void {
    this.user = this.storageService.getUser()?.name;
    this.userEmail = this.storageService.getUser()?.email;
  }
}
