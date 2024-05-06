import { Component, OnInit, TemplateRef, inject } from '@angular/core';

import { Observable, map } from 'rxjs';
import { AddressResponse } from '../../../types/address.response.type';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {
  AddressService,
  StateResponse,
} from '../../../services/address/address.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddressRequest } from '../../../types/address.request.type';

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

  title: string = 'Novo Endereço';
  dataStates$ = new Observable<StateResponse[]>();
  dataCities$ = new Observable<StateResponse[]>();
  addressIdDelete: string = '';
  isDisabledCities: boolean = true;
  constructor(
    private addressServe: AddressService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private formBuilderService: FormBuilder
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
    postalCode: [
      '',
      [Validators.required, Validators.maxLength(8), Validators.minLength(8)],
    ],
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



  onSubmit(modalRef: any) {
    const isFormValid = this.form.valid;

    if (isFormValid) {
      const requestData = this.form.value;
      if (this.form.value.id) {
        this.addressServe.putAddressByUser(requestData).subscribe({
          next: (value) => {
            this.toastr.success('Endereço editado com sucesso');
            this.listAllAddressByUser();
          },
          error: (value) => {
            this.toastr.error('Error ao editar o endereço');
          },
        });
      } else {
        this.addressServe.createAddressByUser(requestData).subscribe({
          next: (value) => {
            this.toastr.success('Endereço salvo com sucesso');
            this.listAllAddressByUser();
          },
          error: (value) => {
            this.toastr.error('Error ao salvar o endereço');
          },
        });
      }
      this.form.reset();

      modalRef.dismiss();
    } else {
      this.toastr.error('Preencha todos os campos');
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
      this.dataCities$ = this.addressServe.getAllCitieyByState(
        parseInt(inputElement.value)
      );
      this.isDisabledCities = false;
    }
  }
  onEdit(content: TemplateRef<any>, address: AddressResponse) {
    this.addressServe.getAddressById(address.id).subscribe({
      next: (value) => {
        this.dataCities$ = this.addressServe.getAllCitieyByState(
          value.state.id
        );
        this.form.patchValue({
          id: value.id.toString(),
          postalCode: value.postalCode,
          street: value.street,
          location: value.location,
          locationType: value.locationType,
          neighborhood: value.neighborhood,
          number: value.number,
          block: value.block,
          lot: value.lot,
          complement: value.complement,
          cityId: value.city.id.toString(),
          stateId: value.state.id.toString(),
          isMainAddress: value.isMainAddress,
        });
      },
    });

    this.title = 'Editar Endereço';
    this.open(content);
  }

  onDelete(address: AddressResponse) {
    this.addressIdDelete = address.id.toString();
    this.addressServe.deleteAddressByUser(address.id).subscribe({
      next: (value) => {
        this.toastr.success('Endereço deletado com sucesso');
        this.listAllAddressByUser();
      },
      error: (value) => {
        this.toastr.error('Error ao deletar o endereço');
      },
    });

  }
}
