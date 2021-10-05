import { LoginService } from "src/app/services/login-service/login.service";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Data } from "@angular/router";
import { CartInfo } from "src/app/login-credentials/constants/cartData";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  cartDataInfo;
  name;
  displayedColumns = [
    "orderNumber",
    "buyerName",
    "address",
    "phoneNo",
    "orderTotal",
    "Action",
  ];
  constructor(public dialog: MatDialog, private loginService: LoginService) {
    localStorage.setItem("CartInfo", JSON.stringify(CartInfo.cartData));
  }

  ngOnInit(): void {
    this.cartDataInfo = JSON.parse(localStorage.getItem("CartInfo"));
    this.loginService.isDataUpdated.subscribe((res) => {
      if (res) {
        this.cartDataInfo = JSON.parse(localStorage.getItem("CartInfo"));
      }
    });
    this.loginService.loginStatus.subscribe((res) => {
      if (res) {
        let userObj = JSON.parse(sessionStorage.getItem("currentUser"));
        this.name = userObj.name;
      }
    });
  }

  edit(element, event) {
    const dialogRef = this.dialog.open(EditComponent, {
      data: element,
    });
    event.stopPropagation();

    dialogRef.afterClosed().subscribe((res) => {
      this.cartDataInfo = JSON.parse(localStorage.getItem("CartInfo"));
    });
  }
  delete(element, event) {
    let cartInfo = JSON.parse(localStorage.getItem("CartInfo"));
    let temp = [...cartInfo];
    localStorage.setItem("CartInfo", "");
    temp.forEach((e) => {
      if (e.orderNumber == element.orderNumber) {
        temp.splice(temp.indexOf(e), 1);
        this.loginService.isDataUpdated.next(true);
      }
    });
    localStorage.setItem("CartInfo", JSON.stringify(temp));
    this.cartDataInfo = temp;
  }
}

@Component({
  styleUrls: ["./cart.component.css"],
  selector: "dialog-data-example-dialog",
  template: `
    <h1>EDIT</h1>
    <form [formGroup]="editForm" class="login-fields">
      <div>
        <mat-form-field appearance="outline">
          <mat-label>BuyerName</mat-label>
          <input
            formControlName="buyerName"
            matInput
            placeholder="BuyerName"
            autocomplete
          />
        </mat-form-field>
      </div>
      <div>
        <mat-form-field appearance="outline">
          <mat-label>Address</mat-label>
          <input
            formControlName="address"
            matInput
            placeholder="Address"
            autocomplete
          />
        </mat-form-field>
      </div>
      <div>
        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input
            formControlName="phone"
            matInput
            placeholder="Phone"
            autocomplete
          />
        </mat-form-field>
      </div>
      <div class="button-container">
        <div>
          <button (click)="edit()" mat-raised-button color="primary">
            Edit
          </button>
        </div>
        <div>
          <button (click)="cancel()" mat-raised-button>Cancel</button>
        </div>
      </div>
    </form>
  `,
})
export class EditComponent {
  editForm = this.fb.group({
    buyerName: [""],
    address: [""],
    phone: [""],
  });
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private loginService: LoginService,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {
    this.editForm.patchValue({
      buyerName: data.buyerName,
      address: data.address,
      phone: data.phoneNo,
    });
  }

  edit() {
    let cartInfo = JSON.parse(localStorage.getItem("CartInfo"));
    let temp = [...cartInfo];
    localStorage.setItem("CartInfo", "");
    temp.forEach((e) => {
      if (e.orderNumber == this.data.orderNumber) {
        e.buyerName = this.editForm.get("buyerName").value;
        e.address = this.editForm.get("address").value;
        e.phoneNo = this.editForm.get("phone").value;
        this.loginService.isDataUpdated.next(true);
      }
    });
    localStorage.setItem("CartInfo", JSON.stringify(temp));
    this.dialog.closeAll();
  }
  cancel() {
    this.dialog.closeAll();
  }
}

@Component({
  selector: "dialog-data-example-dialog",
  template: "<h1 mat-dialog-title>Delete</h1>",
})
export class DeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Data) {
    console.log(data);
  }
}
