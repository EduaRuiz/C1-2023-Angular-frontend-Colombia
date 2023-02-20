import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from 'src/app/modules/account/services';
import { DepositService } from '../../services';

// Interfaces
import { PageAccountsInterface } from '../../../account/interfaces';
import { PageDepositInterface } from '../../interfaces';
import { TableDataInterface } from 'src/app/shared/interfaces';

// Models
import { DateRangeModel, PaginationModel } from '../../../../shared/models';

@Component({
  selector: 'sofka-bank-deposits-detail',
  templateUrl: './deposits-detail.component.html',
  styleUrls: ['./deposits-detail.component.scss']
})
export class DepositsDetailComponent implements OnInit {

  /**
   * @description componente que muestra los detalles de los tepositos que se reciben mediante el servicio de depósitos
   */

  accountId!: string;
  pagination!: PaginationModel;
  dateRange!: DateRangeModel;
  accounts!: PageAccountsInterface;
  tableData!: TableDataInterface;
  hiddenCols!: string[];
  titles!: string[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly deposit$: DepositService,
    private readonly account$: AccountService,

  ) {
    this.accountId = this.route.snapshot.paramMap.get('id') ?? '';
    this.pagination = new PaginationModel(1, 10);
    this.dateRange = new DateRangeModel(new Date('1999-01-01').getTime(), Date.now())
    this.titles = ['Id', 'Amount', 'Date'];
    this.hiddenCols = ['accountId'];
  }

  ngOnInit(): void {
    this.getAllAccounts()
    this.getAllDepositsById();
  }

  onDateRange(dateRange: DateRangeModel): void {
    this.dateRange = dateRange;
    this.getAllDepositsById();
  }

  onGetPage(pagination: PaginationModel): void {
    this.pagination = pagination;
    this.getAllDepositsById();
  }

  onAccountId(accountId: string) {
    this.accountId = accountId;
    this.getAllDepositsById();
  }

  getAllDepositsById() {
    this.deposit$.getDepositsByAccountId(this.accountId, this.pagination, this.dateRange).subscribe({
      next: (data: PageDepositInterface) => {
        this.tableData = {
          ...data, titles: this.titles, items: this.format(data.deposits, this.hiddenCols)
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
