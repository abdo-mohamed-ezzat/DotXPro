import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { IAPIResponse } from '../viewModels/iapiresponse';
import { IAccountStatementReport } from '../viewModels/iaccount-statement-report';
import { EMPTY, Observable, catchError, map, of, throwError } from 'rxjs';
import { IAccount } from '../viewModels/iaccount';
import { ICostCenter } from '../viewModels/icost-center';
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
import { IYear } from '@app/viewModels/iyear';
import { IBranch } from '@app/viewModels/ibranch';
import { AlertController } from '@ionic/angular';
import { IOneAccountStatementReport } from '@app/viewModels/ione-account-statement-report';
import { SharedTableDataService } from './shared-table-data.service';
import { ICurrency } from '@app/viewModels/currency';
@Injectable({
  providedIn: 'root',
})
export class APIService {
  currentReportTotalCount: number = 0;
  done = false;
  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private tableService: SharedTableDataService,
  ) {}
  private handleError(error: any): Observable<never> {
    if (error.error instanceof Error) {
      this.presentAlert('حدث خطأ برجاء التحقق من الاتصال بالانترنت')
    } else {
      if(error.message.includes('no data'))
       this.presentAlert('لا يوجد بيانات')
      else 
      this.presentAlert('حدث خطأ برجاء المحاولة في وقت لاحق')
    }
    return throwError(() => new Error(error));
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
        httpParams = httpParams.set(key, params[key]);
      }
    }
    const fullUrl = `${environment.APIURL}/${endpoint}`;

    return this.http
      .get<IAPIResponse<T>>(fullUrl, {
        params: httpParams,
      })
      .pipe(
        map((res: any) => {
          if (res.success) {
            if (!endpoint.includes('CommonLists')) {
              this.currentReportTotalCount = res.totalCount;
              this.tableService.setTotalCount(res.totalCount);
            }
            return res.data;
          } else {
            throw new Error(res.message);
          }
        }),
        catchError((error) => {
          this.handleError(error);
          return of(null);
        })
      );
  }

  get getCurrentReportTotalCount(): number {
    return this.currentReportTotalCount;
  }
  
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
  getAllCurrencies(): Observable<ICurrency[]> {
    const endpoint = 'CommonLists/GetAllCurrencies';
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

  getAllBranches(): Observable<IBranch[]> {
    const endpoint = 'CommonLists/GetAllBranches';
    return this.apiCall(endpoint);
  }

  checkToken(): Observable<boolean> {
    return this.http
      .get<IAPIResponse<any>>(
        `${environment.APIURL}/Administration/Auth/CheckToken`
      )
      .pipe(
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
