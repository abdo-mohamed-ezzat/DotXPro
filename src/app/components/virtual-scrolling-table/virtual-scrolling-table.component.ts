import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  ViewChild,
  Renderer2,
  Input,
  Output,
} from '@angular/core';
import { SharedTableDataService } from '@app/services/shared-table-data.service';
import { ColumnDef } from '@app/viewModels/column-def';
import { Observable, Subscription, distinctUntilChanged, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-virtual-scrolling-table',
  templateUrl: './virtual-scrolling-table.component.html',
  styleUrls: ['./virtual-scrolling-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualSCrollingTableComponent implements OnInit {
  offset!: number;
  showTotal!: boolean;
  private mySubscription: Subscription[] = [];
  @Input() MAX_COUNT!: number;
  @Output() fetchMoreData = new EventEmitter<void>();
  columnDefs!: ColumnDef[];
  ITEM_SIZE: number = 50;
  items: any[] = [];
  pageSize: number = environment.PAGE_SIZE;
  loading: boolean = false;
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  viewPort!: CdkVirtualScrollViewport;
  reportType!: string;
  constructor(
    private renderer: Renderer2,
    private tableDataService: SharedTableDataService
  ) {
    this.showTotal = false;
    this.mySubscription.push(
      this.tableDataService.tableData$.subscribe((data) => {
        this.items = data;
        this.setSmallTableWidth();
        this.setSrollContentWidth();
        this.showTotal = data.length == this.MAX_COUNT;
      })
    );
    this.mySubscription.push(
      this.tableDataService.currentColumns$.subscribe((columns) => {
        this.columnDefs = columns;
        this.fetchedRanges.clear();
        this.setSrollContentWidth();
        this.viewPort.scrollToIndex(0);
      })
    );
    this.mySubscription.push(
      this.tableDataService.currentTotalCount$.subscribe((count) => {
        this.MAX_COUNT = count;
        this.showTotal = this.items.length == this.MAX_COUNT;
      })
    );

    this.mySubscription.push(
      this.tableDataService.ReportType$.subscribe((reportType) => {
        this.reportType = reportType;
      })
    );
  }

  /**
   * Check if the given value is a float.
   *
   * @param {any} value - the value to be checked
   * @return {boolean} true if the value is a float, false otherwise
   */
  isFloat(value: any): boolean {
    return !isNaN(value) && Number(value) === value && value % 1 !== 0;
  }

  isDate(str: string): boolean {
    // Regular expression to match specific date format (YYYY-MM-DDTHH:mm:ss)
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

    // Check if string matches the regex and parse as Date object
    return regex.test(str) && !isNaN(new Date(str).getTime());
  }

  // getTotal(field: string): number {
  //   if(['incomeStatement', 'balanceSheet', 'trialBalance'].includes(this.reportType) && this.reportType){
  //     let total = 0;
  //     for(let row of this.items){
  //       if([4, 3, 2, 1].includes(row['accountNumber']) && row[field]){
  //         console.log("ok");
  //         total += Number(row[field]);
  //       }
  //     }
  //     return total;
  //   }
  //   return this.MAX_COUNT != this.items.length
  //     ? 0
  //     : this.items.reduce((sum, item) => {
  //         console.log('Sum:', sum, 'Item:', item[field]);
  //         return sum + Number(item[field]);
  //       }, 0);
  // }
  getTotal(field: string): number {
    if (this.MAX_COUNT !== this.items.length) {
      return 0;
    }
    if (
      ['incomeStatement', 'balanceSheet', 'trialBalance'].includes(
        this.reportType
      ) &&
      this.reportType
    ) {
      let total = 0;
      for (let row of this.items) {
        if ([4, 3, 2, 1].includes(row['accountNumber']) && row[field]) {
          console.log('ok');
          total += Number(row[field]);
        }
      }
      return total;
    }
    console.log('test');
    return this.items.reduce((sum, item) => sum + Number(item[field]), 0);
  }
  ngOnInit() {
    this.viewPort.scrolledIndexChange
      .pipe(
        map(() => {
          const offset = this.viewPort.getOffsetToRenderedContentStart();
          return offset !== null ? offset * -1 : 0;
        }),
        distinctUntilChanged()
      )
      .subscribe((offset) => (this.offset = offset));

    this.viewPort.renderedRangeStream.subscribe((range) => {
      this.offset = range.start * -this.ITEM_SIZE;
    });
  }
  /**
   * ngAfterViewInit function to set scroll content width after view initialization.
   */
  ngAfterViewInit() {
    this.setSmallTableWidth();
    this.setSrollContentWidth();
  }

  setSmallTableWidth() {
    setTimeout(() => {
      const table = this.viewPort.elementRef.nativeElement.querySelector(
        'table'
      ) as HTMLElement;
      const container = this.viewPort.elementRef.nativeElement;
      const tableWidth = table.offsetWidth;
      const containerWidth = container.offsetWidth;
      const tableIsEmpty = !table.querySelector('tbody tr');

      if (tableWidth < containerWidth && tableIsEmpty) {
        this.renderer.setStyle(table, 'width', `${containerWidth}px`);
      } else if (!tableIsEmpty) {
        this.renderer.removeStyle(table, 'width');
      }
    });
  }

  /**
   * Sets the scroll content width after a timeout, based on the width of a table inside the viewPort element.
   */
  setSrollContentWidth() {
    setTimeout(() => {
      const table = this.viewPort.elementRef.nativeElement.querySelector(
        'table'
      ) as HTMLElement;
      const tableWidth = table.offsetWidth;
      this.renderer.setStyle(
        this.viewPort.elementRef.nativeElement,
        'width',
        `${tableWidth}px`
      );
    });
  }

  fetchedRanges = new Set<number>();
  /**
   * Handles the scroll event at the specified index.
   *
   * @param {number} index - the index of the scroll event
   */
  onScroll(index: number) {
    this.showTotal = this.items.length == this.MAX_COUNT;
    this.setSrollContentWidth();
    const renderedRange = this.viewPort.getRenderedRange();
    const end = renderedRange.end;
    let currentPageIndex = Math.ceil(end / environment.PAGE_SIZE);
    const nextRange = end + 1;
    let dataLength = this.items.length;

    // console.log('Data Length:', dataLength);
    // console.log('Current Page Index:', currentPageIndex);

    if (dataLength <= this.pageSize) currentPageIndex = 1;
    if (
      end == dataLength &&
      !this.fetchedRanges.has(nextRange) &&
      dataLength > 0 &&
      dataLength < this.MAX_COUNT
    ) {
      // console.log('Fetching more data...');
      this.fetchedRanges.add(nextRange);
      this.tableDataService.setCurrentPageIndex(currentPageIndex + 1);
      this.fetchMoreData.emit();
      this.viewPort.scrollToIndex(this.items.length - 1);
    }
  }

  ngOnDestroy() {
    this.mySubscription.forEach((sub) => sub.unsubscribe());
    this.tableDataService.setCurrentReportType('');
  }
}
