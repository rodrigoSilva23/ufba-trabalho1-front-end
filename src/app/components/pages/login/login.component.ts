import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface LoginForm {
  email: FormControl;
  password: FormControl;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  submitForm() {
    this.loginService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.toastr.success('Login realizado com sucesso');
          this.router.navigateByUrl('/home');

        },
        error: (value) => {

          this.toastr.error('Login ou senha inválidos');
        },
      });
  }
}
