import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@app/services/alert.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { TimeService } from '@app/services/time.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  submitted = false;
  error = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private timeService: TimeService,
    private alertService: AlertService
  ) {
    if (this.authenticationService.userValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      branchID: ['', Validators.required],
      theYear: [this.timeService.getCurrentDate(), Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;

    this.alertService.clear();

    if (this.loginForm.invalid) {
      console.log('invalid');
      return;
    }
    console.log(this.f);
    const year = Number(new Date(this.f['theYear'].value).getFullYear());
    const branchID = Number(this.f['branchID'].value);
  

    this.loading = true;
    this.authenticationService
      .login(
        this.f['userName'].value,
        this.f['password'].value,
        branchID,
        year
      )
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }
}
