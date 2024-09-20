import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pokemon } from './services/pokemon.service';
import { PokemonService } from './services/pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [] ;
  PokemonSubcription: Subscription | undefined;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.PokemonSubcription = this.pokemonService.getPokemons().subscribe(pokemon => {
      this.pokemons = pokemon;
    })
  }

  ngOnDestroy(): void {
    if (this.PokemonSubcription) {
      this.PokemonSubcription.unsubscribe();
    }
  }
}
