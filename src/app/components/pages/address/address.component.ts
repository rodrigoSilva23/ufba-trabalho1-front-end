import { Component, OnInit, TemplateRef, inject } from '@angular/core';

import { Observable, map } from 'rxjs';
import { AddressResponse } from '../../../types/address.response.type';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AddressService, StateResponse } from '../../../services/address/address.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-endereco',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, ReactiveFormsModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent implements OnInit {
  currentPage = 1;
  collectionSize = 1;
  pageSize = 5;
  addresses$ = new Observable<AddressResponse[]>();
  typeMod: 'edit' | 'new' = 'new';
  title: 'edit' | 'new' = 'new';
  dataStates$ = new Observable<StateResponse[]>();
  dataCities$ = new Observable<StateResponse[]>();
  isDisabledCities: boolean = true;
  constructor(
    private addressServe: AddressService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private formBuilderService:FormBuilder
  ) {}

  ngOnInit(): void {
    this.listAllAddressByUser();
  }

  listAllAddressByUser() {
    this.addresses$ = this.addressServe
      .getAllAddressByUser(this.currentPage - 1, this.pageSize)
      .pipe(
        map((pagination) => {
          this.collectionSize = pagination.totalElements;
          return pagination.content;
        })
      );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.listAllAddressByUser();
  }

  protected form = this.formBuilderService.group({
    id: [''],
    postalCode: ['', Validators.required],
    street: ['', Validators.required],
    location: ['', Validators.required],
    locationType: [''],
    neighborhood: ['', Validators.required],
    number: ['', Validators.required],
    block: [''],
    lot: [''],
    complement: [''],
    cityId: ['', Validators.required],
    stateId: ['', Validators.required],
    isMainAddress: [false, Validators.required],
  });

  deleteAddressByUser(addressId: number) {
    this.addressServe.deleteAddressByUser(addressId);
  }

  onSubmit(modalRef: any) {
    const isFormValid = this.form.valid;

    if (isFormValid) {
      //this.addressServe.createAddressByUser(this.form.value);
      modalRef.dismiss()
      this.toastr.success('Endereço salvo com sucesso');
    }


  }

  open(content: TemplateRef<any>) {
    this.dataStates$ = this.addressServe.getAllState();
    this.isDisabledCities = true;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-title',
      scrollable: true,
      size: 'lg',
    });
  }
  handleChangeState(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value) {
      this.dataCities$ = this.addressServe.getAllCitieyByState(parseInt(inputElement.value));
      this.isDisabledCities = false;
    }

  }
}
