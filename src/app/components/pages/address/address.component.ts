import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../../services/address.service';
import { Observable, map } from 'rxjs';
import { AddressResponse } from '../../../types/address.response.type';
import { CommonModule } from '@angular/common';
import { NgbPaginationConfig, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-endereco',
  standalone: true,
  imports: [
    CommonModule,
    NgbPaginationModule
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
  currentPage = 1;
  collectionSize = 1
  pageSize = 5
  addresses$ = new Observable<AddressResponse[]>();
  constructor(
    private addressServe: AddressService,config: NgbPaginationConfig
  ) { }
  ngOnInit(): void {
    this.listAllAddressByUser()

  }

  deleteAddressByUser(addressId: number) {
    this.addressServe.deleteAddressByUser(addressId);
  }
  listAllAddressByUser() {
    this.addresses$ = this.addressServe.getAllAddressByUser(this.currentPage-1, this.pageSize).pipe(
      map(pagination =>{
        this.collectionSize = pagination.totalElements
        return pagination.content
      })
    );

  }

  onPageChange(page: number) {
    this.currentPage = page
    this.listAllAddressByUser()

  }
}
