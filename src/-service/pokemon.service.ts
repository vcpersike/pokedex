import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../-model/Pokemon';
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {

  public pokemons: Pokemon[] = [];

  constructor(
    private httpClient: HttpClient,
  ) {
    const allPokemonsUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    this.httpClient.get<any>(allPokemonsUrl).pipe(
      map(value => value.results),
      map((value: any) => {
        return from(value).pipe(
          mergeMap((v: any) => this.httpClient.get(v.url)),
        );
      }),
      mergeMap(value => value),
    ).subscribe((result: any) => {
      this.pokemons[result.id] = {
        image: result.sprites.front_default,
        number: result.id,
        name: result.name,
        abilities: result.abilities,
        base_experience: result.base_experience,
        height: result.height,
        location_area_encounters: result.location_area,
        species: result.species,
        stats: result.stats,
        weight: result.weight,
        types: result.types.map((t: { type: { name: any; }; }) => t.type.name),
      }
    });
  }
}