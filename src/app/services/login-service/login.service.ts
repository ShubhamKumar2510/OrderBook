import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  loginStatus = new BehaviorSubject(false);
  isDataUpdated = new BehaviorSubject(false);
  constructor() {}
}
