import { LoginService } from "./../../../services/login-service/login.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  loginStatus: any;
  name;
  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.loginStatus.subscribe((res) => {
      this.loginStatus = res;
      if (res) {
        let userObj = JSON.parse(sessionStorage.getItem("currentUser"));
        this.name = userObj.name;
      }
    });
  }

  logout() {
    sessionStorage.clear();
    this.loginService.loginStatus.next(false);
    this.loginStatus = false;
    this.router.navigate(["/"]);
  }

  logoClick() {
    this.router.navigate(["/"]);
  }
}
