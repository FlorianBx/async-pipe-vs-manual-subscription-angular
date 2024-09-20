import { Component, OnInit } from '@angular/core';
import { Pokemon } from './services/pokemon.service';
import { PokemonService } from './services/pokemon.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  pokemons$: Observable<Pokemon[]> | undefined;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.pokemons$ = this.pokemonService.getPokemons();
  }
}
