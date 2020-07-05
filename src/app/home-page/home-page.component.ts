import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { of } from "rxjs";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
})
export class HomePageComponent implements OnInit {
  public signUpForm: FormGroup;
  error = false;
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      name: new FormControl(undefined, {
        validators: [Validators.required, Validators.minLength(4)],
      }),
      email: new FormControl(undefined, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(undefined, {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }
  sendForm() {
    if (this.signUpForm.valid) {
      this.httpClient
        .post("https://unapiclaramenteinexistente.com", this.signUpForm.value)
        .subscribe(
          (res: any) => {
            console.log("HomePageComponent -> sendForm -> res", res);
            if (res && res.status) {
              this.router.navigate(["detail"]);
            }
          },
          (errr) => {
            this.error = true;
          }
        );
    }
  }
}
