import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth/auth.service';
import { map } from 'rxjs';
import { AddressResponse } from '../types/address.response.type';
import { Pagination } from '../types/pagination.type';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  apiUrl: string = environment.apiUrl;
  userId: number | null;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.userId = authService.getUserDetail()?.id || null;
  }

  getAllAddressByUser(page: number = 0, size: number = 5) {
    return this.httpClient
      .get<Pagination<AddressResponse>>(
        `${this.apiUrl}/user/${this.userId}/address?&page=${page}&size=${size}`
      );
  }

  deleteAddressByUser(addressId: number) {
    return this.httpClient.delete<AddressResponse[]>(
      `${this.apiUrl}/user/${this.userId}/address/${addressId}`
    );
  }
}
