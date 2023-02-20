import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../../services';
import { NewAccountModel } from '../../models';
import { AccountInterface, PageAccountsInterface } from '../../interfaces';
import { AccountTypeEnum } from '../../enums';
import { BackgroundColorService } from '../../../../shared/services/background-color.service';

import Swal from 'sweetalert2'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sofka-bank-accounts-detail',
  templateUrl: './accounts-detail.component.html',
  styleUrls: ['./accounts-detail.component.scss']
})
export class AccountsDetailComponent implements OnInit {

  accounts!: PageAccountsInterface;
  pagination = { currentPage: 1, range: 10 }
  totalPages = 1;
  closeResult: string = '';
  accountIdSelected!: string;
  outcomeAccountSelected!: AccountInterface;
  idToDelete!: string;

  constructor(
    private readonly account$: AccountService,
    private readonly router: Router,
    private readonly backgroundColor$: BackgroundColorService,
    private readonly modalService: NgbModal

  ) { }

  ngOnInit(): void {
    AccountTypeEnum['Checking account'];
    this.getAll();
    // Swal.fire('Any fool can use a computer')
  }

  getAll(): void {
    this.account$.getAccounts(this.pagination).subscribe({
      next: (data) => this.accounts = data,
      error: (err) => this.handlerError(err),
      complete: () => this.totalPages = this.accounts.totalPages,
    });
  }

  delete(content: any): void {
    content.close();
    this.account$.deleteAccount(this.idToDelete).subscribe({
      next: (data) => this.handlerSuccess(),
      error: (err) => this.handlerError(err),
      complete: () => this.totalPages = this.accounts.totalPages,
    });
  }

  add(accountTypeId: 'Checking account' | 'Saving account'): void {
    const newAccount = new NewAccountModel(AccountTypeEnum[accountTypeId])
    this.account$.createAccount(newAccount).subscribe({
      next: (data) => this.handlerSuccess(),
      error: (err) => this.handlerError(err),
      complete: () => this.totalPages = this.accounts.totalPages,
    });
    this.backgroundColor$.updateColor.emit(!this.backgroundColor$.color);
  }

  onAddDeposit(accountId: string, content: any): void {
    this.accountIdSelected = accountId;
    this.open(content);
  }

  onGenerateTransfer(outhComeAccount: AccountInterface, content: any): void {
    this.outcomeAccountSelected = outhComeAccount;
    this.open(content);
  }

  onDelete(accountId: string, content: any): void {
    this.open(content);
    this.idToDelete = accountId;
  }

  private handlerSuccess(): void {
    this.getAll();
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Done',
      showConfirmButton: false,
      timer: 1000
    });
  }

  private handlerError(err: any): void {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err?.error?.message,
    });
  }

  getPage(page: number): void {
    this.pagination.currentPage = page;
    this.totalPages = this.accounts.totalPages
    this.getAll();
  }

  depositAdded(modal: any): void {
    modal.close();
    this.getAll();
  }

  transferGenerated(modal: any): void {
    modal.close();
    this.getAll();
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    };
  }
}
