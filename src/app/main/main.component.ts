import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  currentRoute: string = '';
  table: boolean = true;
  constructor(private router: Router) {}

  ngOnInit() {
    this.currentRoute = this.router.url;
    if (this.currentRoute === '/main') this.table = true;
  }
}
