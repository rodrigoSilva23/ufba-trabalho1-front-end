import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,RouterLink, RouterLinkActive
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'

})
export class LayoutComponent {
  constructor(private authService: AuthService) { }

  signOut() {
      this.authService.signOut();
  }
}
