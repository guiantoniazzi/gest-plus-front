import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet, SidebarComponent]
})
export class AppComponent {
  showSidebar = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const noSidebarRoutes = ['/', '/login'];
        this.showSidebar = !noSidebarRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}
