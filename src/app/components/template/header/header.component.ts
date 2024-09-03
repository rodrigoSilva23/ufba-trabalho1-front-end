import { Component } from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AuthService } from '../../../services/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive,MatSlideToggleModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private authService: AuthService) { }

  signOut() {
      this.authService.signOut();
  }

  toggleTheme() {
    console.log('toggleTheme');
    if(document.body.classList.contains('dark-theme')){
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }else{
      console.log('asdasdasd');
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  }
}
