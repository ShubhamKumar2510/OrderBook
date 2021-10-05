import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { loginClass } from "src/app/login-credentials/login-constants";
import { Router } from "@angular/router";
import { LoginService } from "src/app/services/login-service/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  allLogin = loginClass;
  hide = true;
  loginForm = this.fb.group({
    userName: [
      "",
      [
        Validators.required,
        Validators.pattern(
          "^([_a-zA-Z0-9.]+)@([a-zA-Z0-9-]+)([.])([a-z]{2,3})([.]([a-z]{2,3}))?$"
        ),
      ],
    ],
    password: ["", Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    console.log(this.allLogin.login);
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    } else {
      let userName = this.loginForm.get("userName").value;
      let password = this.loginForm.get("password").value;
      this.allLogin.login.forEach((element) => {
        if (element.userName == userName && element.password == password) {
          this.loginService.loginStatus.next(true);
          let currentUser = {
            userName: element.userName,
            password: element.password,
            name: element.name,
          };
          sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
          setTimeout(() => {
            this.router.navigate(["/cart"]);
          }, 0);
        }
      });
    }
  }
  cancel() {
    this.loginForm.reset();
  }
  fnShowPassword() {
    this.hide = !this.hide;
  }
}
