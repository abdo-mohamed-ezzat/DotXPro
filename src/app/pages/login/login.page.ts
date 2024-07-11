import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertService } from '@app/services/alert.service';
import { APIService } from '@app/services/api.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { TimeService } from '@app/services/time.service';
import { IBranch } from '@app/viewModels/ibranch';
import { IYear } from '@app/viewModels/iyear';
import { MenuController } from '@ionic/angular';
import { Subject, first, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private destroy$ = new Subject<void>();
  years: IYear[] = [];
  branches: IBranch[] = [];
  loginForm!: FormGroup;
  loading: boolean = false;
  submitted = false;
  error = '';
  showPassword = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private timeService: TimeService,
    private alertService: AlertService,
    private apiService: APIService,
    private menuController: MenuController
  ) {
    if (this.authenticationService.userValue) {
      this.router.navigate(['/home']);
    }
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      branchID: ['0',],
      theYear: [this.timeService.getCurrentYear(),],
    });
    this.apiService.getAllYears().pipe(takeUntil(this.destroy$)).subscribe((years) => {
      this.years = years;
    });
    this.apiService.getAllBranches().pipe(takeUntil(this.destroy$)).subscribe((branches) => {
      this.branches = branches;
    });
    this.router.events.subscribe((ev)=>{
      if (ev instanceof NavigationEnd) {
        this.menuController.enable(this.router.url !== '/login');
      }
    })
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
    // console.log(this.f);
    const branchID = Number(this.f['branchID'].value);
  

    this.loading = true;
    this.authenticationService
      .login(
        this.f['userName'].value,
        this.f['password'].value,
        branchID,
        this.f['theYear'].value
      )
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    this.loading = false;
    this.destroy$.next();
    this.destroy$.complete();
    this.router.events.subscribe().unsubscribe();
  }
}
