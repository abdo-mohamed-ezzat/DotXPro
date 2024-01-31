import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { IAPIResponse } from '../viewModels/iapiresponse';
import { IAccountStatementReport } from '../viewModels/iaccount-statement-report';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { IAccount } from '../viewModels/iaccount';
import { ICostCenter } from '../viewModels/icost-center';
import { DatePipe } from '@angular/common';
import { ISalesSummeryRequest } from '../viewModels/isales-summery-request';
import { IcustomerAndSuplier } from '../viewModels/icustomer-and-suplier';
import { IPaymentMethod } from '../viewModels/ipayment-method';
import { Iitem } from '../viewModels/iitem';
import { ISalesSummeryReport } from '../viewModels/isales-summery-report';
import { IStockInverntoryReport } from '../viewModels/istock-inverntory-report';
import { IStockInventoryRequest } from '../viewModels/istock-inventory-request';
import { ICategory } from '../viewModels/icategory';
import { ISalesProfitReport } from '../viewModels/isales-profit-report';
import { IIncomeStatementRequest } from '../viewModels/iincome-statement-request';
import { IIncomeStatementReport } from '../viewModels/iincome-statement-report';
import { IBalanceSheetReport } from '../viewModels/ibalance-sheet-report';
import { IBalanceSheetRequest } from '../viewModels/ibalance-sheet-request';
import { IBuySummeryReport } from '../viewModels/ibuy-summery-report';
import { ITrialBalanceReport } from '../viewModels/itrial-balance-report';
import { ITrialBalanceRequest } from '../viewModels/itrial-balance-request';
import { IStore } from '../viewModels/istore';
import { AlertController } from '@ionic/angular';
import { IOneAccountStatementReport } from '@app/viewModels/ione-account-statement-report';
import { IYear } from '@app/viewModels/iyear';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private alertController: AlertController,
    private authenticationService: AuthenticationService
  ) {}

  private handleError(error: any) {
    if (error.status === 401 || error.status === 403) {
      this.authenticationService.logout();
      location.reload();
    }
    console.error(error.message);
    this.presentAlert(error.message);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'خطأ',
      message: message,
      buttons: ['تم'],
    });

    await alert.present();
  }

  private apiCall<T>(endpoint: string, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, (params[key]));
      }
    }
    console.log(params);
    const fullUrl = `${environment.APIURL}/${endpoint}`;

    return this.http
      .get<IAPIResponse<T>>(fullUrl, {
        params: httpParams,
      })
      .pipe(
        map((res: any) => {
          if (res.success) {
            return res.data;
          } else {
            throw new Error(res.message);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  //reports

  getAccountStatementReport(
    filters: any
  ):
    | Observable<IAccountStatementReport[]>
    | Observable<IOneAccountStatementReport[]> {
    const endpoint =
      'GeneralLedger/Reports/AccountStatement/GetAllAccountStatementReport';
    return this.apiCall<IAccountStatementReport[]>(endpoint, filters);
  }

  getStockInventoryReportBeforeRelay(
    filters: IStockInventoryRequest
  ): Observable<IStockInverntoryReport[]> {
    const endpoint = 'Inventory/Reports/StockInventory/GetMainStockBeforeRelay';
    return this.apiCall<IStockInverntoryReport[]>(endpoint, filters);
  }

  getStockInventoryAfterRelay(
    filters: IStockInventoryRequest
  ): Observable<IStockInverntoryReport[]> {
    const endpoint = 'Inventory/Reports/StockInventory/GetMainStockAfterRelay';
    return this.apiCall(endpoint, filters);
  }

  getSalesSummeryReport(
    filters: ISalesSummeryRequest
  ): Observable<ISalesSummeryReport[]> {
    const endpoint =
      'Purchase&Sales/Reports/ReportSalesSummary/GetReportSalesSummary';
    return this.apiCall(endpoint, filters);
  }

  getSalesProfitReport(filters: any): Observable<ISalesProfitReport[]> {
    const endpoint = 'Purchase&Sales/Reports/ReportSalesProfit/GetSalesProfit';
    return this.apiCall(endpoint, filters);
  }

  getIncomeStatementReport(
    filters: IIncomeStatementRequest
  ): Observable<IIncomeStatementReport[]> {
    const endpoint =
      'GeneralLedger/FinancialStatements/IncomeStatement/GetIncomeStatement';
    return this.apiCall(endpoint, filters);
  }

  getBalanceSheetReport(
    filters: IBalanceSheetRequest
  ): Observable<IBalanceSheetReport[]> {
    const endpoint =
      'GeneralLedger/FinancialStatements/BalanceSheet/GetBalanceSheet';
    return this.apiCall(endpoint, filters);
  }

  getBuySummeryReport(filters: any): Observable<IBuySummeryReport[]> {
    const endpoint =
      'Purchase&Sales/Reports/ReportBuySummary/GetReportBuySummary';
    return this.apiCall(endpoint, filters);
  }

  getTrialBalanceReport(
    filters: ITrialBalanceRequest
  ): Observable<ITrialBalanceReport[]> {
    const endpoint =
      'GeneralLedger/FinancialStatements/TrialBalance/GetTrialBalance';
    return this.apiCall(endpoint, filters);
  }
  //get all lists

  getAllAccountsNames(): Observable<IAccount[]> {
    const endpoint = 'CommonLists/GetAllAccountsNames';
    return this.apiCall(endpoint);
  }

  getAllCostCenters(): Observable<ICostCenter[]> {
    const endpoint = 'CommonLists/GetAllCostCentersNames';
    return this.apiCall(endpoint);
  }

  getAllStores(): Observable<IStore[]> {
    const endpoint = 'CommonLists/GetAllStores';
    return this.apiCall(endpoint);
  }

  getCustomerNames(): Observable<IcustomerAndSuplier[]> {
    const endpoint = 'CommonLists/GetAllCustomersAndSuppliers';
    return this.apiCall(endpoint);
  }

  getUsedMethod(): Observable<IPaymentMethod[]> {
    const endpoint = 'CommonLists/GetUsedMethods';
    return this.apiCall(endpoint);
  }

  getitemName(): Observable<Iitem[]> {
    const endpoint = 'CommonLists/GetAllItems';
    return this.apiCall(endpoint);
  }

  getFilteredItems(name: string, names: Iitem[]): Observable<Iitem[]> {
    return of(names).pipe(
      map((items) =>
        items.filter((item) =>
          item.value.toLowerCase().includes(name.toLowerCase())
        )
      )
    );
  }

  getPaymentMethod(): Observable<IPaymentMethod[]> {
    const endpoint = 'CommonLists/GetUsedMethods';
    return this.apiCall(endpoint);
  }

  getAllCategories(): Observable<ICategory[]> {
    const endpoint = 'CommonLists/GetAllCategories';
    return this.apiCall(endpoint);
  }

  getAccountsLevels(): Observable<number[]> {
    const endpoint = 'CommonLists/GetAccountsLevels';
    return this.apiCall(endpoint);
  }

  getAllYears(): Observable<IYear[]> {
    const endpoint = 'CommonLists/GetAllYears';
    return this.apiCall(endpoint);
  }
  checkToken(): Observable<boolean> {
    return this.http.get<IAPIResponse<any>>(`${environment.APIURL}/Administration/Auth/CheckToken`).pipe(
      map((res) => {
        if (res.success) {
          return true;
        } else {
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error checking token:', error);
        return of(false); // Always return false if the request fails
      })
    );
  }
}
