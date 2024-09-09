import { Component, TemplateRef } from '@angular/core';
import { DialogComponent } from '../../dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../loading/loading.component';
import { PokemonApiService } from '../../../services/pokemon-api/pokemon-api.service';
import { map, Observable } from 'rxjs';
import { AddressService } from '../../../services/address/address.service';
import { AddressResponse } from '../../../types/address.response.type';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    DialogComponent,
    LoadingComponent,
  ],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.scss',
})
export class PokemonComponent {
  currentPage = 1;
  collectionSize = 1;
  pageSize = 5;
  pokemons$ = new Observable<any>();
  addresses$ = new Observable<AddressResponse[]>();
  type = 'create';
  pokemonImage = '';
  addressIdDelete: string = '';
  isDisabledCities: boolean = true;
  isLoading: boolean = true;
  isCityLoading = false;
  isSubmit = false;
  constructor(
    private toastr: ToastrService,
    private formBuilderService: NonNullableFormBuilder,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private pokemonApiService: PokemonApiService,
    private addressServe: AddressService,
  ) {}

  ngOnInit(): void {
    this.listAllAddressByUser();
    this.pokemons$  = this.pokemonApiService.getAllPokemon();
  }



  onPageChange(page: number) {
    this.currentPage = page;
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
    this.isSubmit = true;
    if (isFormValid) {
      const requestData = this.form.value;

      if (this.form.value.id) {
      } else {
      }
      this.form.reset();
      this.isSubmit = false;
      modalRef.dismiss();
    } else {
      this.toastr.error('Preencha todos os campos');
    }
  }

  open(content: TemplateRef<any>) {
    this.isDisabledCities = true;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-title',
        scrollable: true,
        size: 'lg',
      })
      .result.then(
        (result) => {
          this.form.reset();
        },
        (reason) => {
          this.form.reset();
        }
      )
      .catch((error) => {
        this.form.reset();
      });
  }
  onSelectPokemon ( event: any){
    const url = event?.target?.value;  // Pega o valor selecionado do select
    this.pokemonImage = '' ;
  if (url) {
    this.pokemonApiService.getPokemonByUrl(url).subscribe({
      next: (pokemonDetails) => {
        console.log(pokemonDetails);
        this.pokemonImage = pokemonDetails.sprites.front_default;
      },
      error: (err) => {
        console.error('Erro ao buscar Pokémon:', err);  // Trata o erro
      }
    });
  };
  /*
  onEdit(content: TemplateRef<any>, address: AddressResponse) {
    this.type = 'edit';
    this.addressServe.getAddressById(address.id).subscribe({
      next: (value) => {

        this.dataCities$ = this.addressServe.getAllCitieyByState(
          value.state.id
        );

        this.form.patchValue({
          ...value,
          cityId: value.city.id.toString(),
          stateId: value.state.id.toString(),
          id: value.id.toString(),
        });
      },
    });

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
*/
 /* openDialog(address: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Deletar',
        content: 'Tem certeza que deseja deletar o endereço?',
        type: 'Deletar',
      },
    });*

    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed) {
        //this.onDelete(address!);
      }
    });
  }*/
 
}
listAllAddressByUser() {
  this.isLoading = true;
  this.addresses$ = this.addressServe
    .getAllAddressByUser(this.currentPage - 1, this.pageSize)
    .pipe(
      map((pagination) => {
        this.collectionSize = pagination.totalElements;
        return pagination.content;
      })
    );
  this.addresses$.subscribe(() => (this.isLoading = false));
}
}
