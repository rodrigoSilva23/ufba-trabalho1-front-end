import { TestBed } from '@angular/core/testing';

import { PokemonApiServiceService } from './pokemon-api-service.service';

describe('PokemonApiServiceService', () => {
  let service: PokemonApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
