import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { ColumnDef } from '@app/viewModels/column-def';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-virtual-scroll-table',
  templateUrl: './virtual-scroll-table.component.html',
  styleUrls: ['./virtual-scroll-table.component.scss'],
})
export class VirtualScrollTableComponent implements OnInit {
  @Input() columnDefs!: ColumnDef[];
  @Input() reportData!: any[];
  @Input() pageSize!: number;
  @Input() loadDataFunction!: (page: number, size: number) => Observable<any[]>;

  fetchedRanges = new Set<number>(); // keep track of the ranges we have already fetched
  // dataSource!: TableVirtualScrollDataSource<any>;
  dataSource!: MatTableDataSource<any>
  displayedColumns!: string[];

  ITEM_SIZE = 40;

  @ViewChild(CdkVirtualScrollViewport, { static: true })
  viewPort!: CdkVirtualScrollViewport;
  offset!: number;

  constructor(private renderer: Renderer2) {
    this.pageSize = 11;
    this.columnDefs = [
      { field: 'date', displayName: 'Date', hide: false },
      { field: 'name', displayName: 'Name', hide: false },
      { field: 'age', displayName: 'Age', hide: false },
      { field: 'address', displayName: 'Address', hide: false },
      { field: 'phone', displayName: 'Phone', hide: false },
      { field: 'email', displayName: 'Email', hide: false },
      { field: 'company', displayName: 'Company', hide: false },
      { field: 'balance', displayName: 'Balance', hide: false },
    ];

    this.displayedColumns = this.columnDefs
      .filter((col) => !col['hide'])
      .map((col) => col.field);

    this.dataSource = new TableVirtualScrollDataSource([
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
      {
        date: '2019-10-01',
        name: 'John Doe',
        age: 30,
        address: 'New York No. 1 Lake Park',
        phone: '13333333333',
        email: 'asfdsf@ddd.com',
        company: 'company',
        balance: 'balance',
      },
    ]);

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

  ngAfterViewInit() {
    let contentWrapperWidth;
    setTimeout(() => {
      const contentWrapper =
        this.viewPort.elementRef.nativeElement.querySelector(
          '.cdk-virtual-scroll-content-wrapper'
        ) as HTMLElement;
      contentWrapperWidth = contentWrapper.offsetWidth;
      this.renderer.setStyle(
        this.viewPort.elementRef.nativeElement,
        'width',
        `${contentWrapperWidth}px`
      );
    });
  }

  onScrollIndexChange(index: number) {
    const renderedRange = this.viewPort.getRenderedRange();
    const end = renderedRange.end;
    const total = this.viewPort.getDataLength();
    console.log(
      'end',
      end,
      '     total',
      total,
      '      index',
      index,
      '     renderedRange',
      renderedRange
    );
    if (end === total && !this.fetchedRanges.has(end + 1)) {
      console.log('fetching more data');
      // this.loadDataFunction(end + 1, this.pageSize).subscribe(newItems => {
      //   this.dataSource.data = [...this.dataSource.data, ...newItems];
      //   this.fetchedRanges.add(end + 1);
      // });
    }
  }
}
