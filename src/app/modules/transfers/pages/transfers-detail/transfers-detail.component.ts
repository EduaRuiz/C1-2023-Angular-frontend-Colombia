import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from 'src/app/modules/account/services';
import { TransferService } from '../../services';

// Interfaces
import { PageAccountsInterface } from '../../../account/interfaces';
import { PageTransfersInterface } from '../../interfaces';
import { TableDataInterface } from 'src/app/shared/interfaces';

import { DateRangeModel, PaginationModel } from 'src/app/shared/models';

@Component({
  selector: 'sofka-bank-transfers-detail',
  templateUrl: './transfers-detail.component.html',
  styleUrls: ['./transfers-detail.component.scss']
})
export class TransfersDetailComponent implements OnInit {

  accountId!: string;
  pagination!: PaginationModel;
  dateRange!: DateRangeModel;
  accounts!: PageAccountsInterface;
  tableData!: TableDataInterface;
  hiddenCols!: string[];
  titles!: string[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly transfer$: TransferService,
    private readonly account$: AccountService,

  ) {
    this.accountId = this.route.snapshot.paramMap.get('id') ?? '';
    this.pagination = new PaginationModel(1, 10);
    this.dateRange = new DateRangeModel(new Date('1999-01-01').getTime(), Date.now())
    this.titles = ['OutcomeId', 'IncomeId', 'Amount', 'Reason', 'Date'];
    this.hiddenCols = ['id'];
  }

  ngOnInit(): void {
    this.getAllAccounts()
    this.getAllTransfersById();
  }

  onDateRange(dateRange: DateRangeModel): void {
    this.dateRange = dateRange;
    this.getAllTransfersById();
  }

  onGetPage(pagination: PaginationModel): void {
    this.pagination = pagination;
    this.getAllTransfersById();
  }

  onAccountId(accountId: any) {
    this.accountId = accountId;
    this.getAllTransfersById();
  }

  getAllTransfersById() {
    this.transfer$.getTransfersByAccountId(this.accountId, this.pagination, this.dateRange).subscribe({
      next: (data: PageTransfersInterface) => {
        this.tableData = {
          ...data, titles: this.titles, items: this.format(data.transfers, this.hiddenCols)
        }
      },
      error: (err: Error) => console.log(err),
      complete: () => console.log('complete'),
    })
  }

  getAllAccounts(): void {
    this.account$.getAccounts({ currentPage: 1, range: 100 }).subscribe({
      next: (data) => {
        this.accounts = data
      },
      error: (err) => console.log(err),
      complete: () => console.log('complete'),
    })
  }

  format(items: any[], hiddenCols: string[]): any[][] {
    if (items === undefined) {
      return [[]]
    }
    const result = []
    if (items[0] === undefined) {
      return [[]];
    }
    const keys = Object.keys(items[0]);
    const indexList: number[] = []
    for (let col of hiddenCols) {
      const index = keys.indexOf(col);
      if (index >= 0) { indexList.push(index) }
    }
    indexList.sort().reverse();
    for (let item of items) {
      const values = Object.values(item);
      const keys = Object.keys(item);
      for (let splice of indexList) {
        values.splice(splice, 1)
        keys.splice(splice, 1)
      }
      const row: { key: string, value: unknown }[] = []
      for (let i = 0; i < values.length; i++) {
        const a = { key: keys[i], value: values[i] }
        row.push(a)
      }
      result.push(row);
    }
    return result;
  }
}
