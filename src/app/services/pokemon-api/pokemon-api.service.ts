import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PokemonApiService {


  baseUrl = 'https://pokeapi.co/api/v2/pokemon';
  constructor(private httpClient: HttpClient) {}
  getPokemonbyId(id: number) {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`);
  }
  getPokemonByUrl(url: string){
    return this.httpClient.get<any>(`${url}`);
  }

  getAllPokemon() {
    return this.httpClient.get<any>(`${this.baseUrl}?limit=100000&offset=0`).pipe(
      map(response => response.results)  // Extrai o array 'results'
    );
  }
}
