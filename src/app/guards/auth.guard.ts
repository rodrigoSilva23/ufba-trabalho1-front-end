
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';



export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    console.log(authService.isAuth)
    console.log(authService.isLoggedIn())
    if (authService.isAuth.value == false ) {
      router.navigate(['/auth']);
      return false;
    }
    return authService.isAuth.value;

};
