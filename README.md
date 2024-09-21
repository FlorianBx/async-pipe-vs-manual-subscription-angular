# Gestion des Observables dans Angular

Ce projet démontre deux approches courantes pour gérer les Observables dans Angular : la souscription manuelle et l'utilisation du pipe `async`. Chaque méthode a ses avantages et ses cas d'utilisation spécifiques.

## Objectif du Projet

L'objectif est de récupérer et afficher une liste de Pokémon en utilisant un service qui retourne un Observable. Nous explorerons deux façons de gérer cet Observable dans un composant Angular.

## Comparaison des Implémentations

Vous pouvez voir la différence entre les deux implémentations en un coup d'œil ici :
[Voir la comparaison sur GitHub](https://github.com/FlorianBx/async-pipe-vs-manual-subscription-angular/commit/e3e7e177a31a23120f8252b114f9da8d5ab54c46#diff-884f7f49640e5923f6bcac4c51d90340330a178f662defbe61e5f5aac1c512de)

## Approche 1 : Souscription Manuelle

### Code du Composant (premier commit)

```typescript
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
    });
  }

  ngOnDestroy(): void {
    if (this.PokemonSubcription) {
      this.PokemonSubcription.unsubscribe();
    }
  }
}
```

### Explications

- Nous souscrivons manuellement à l'Observable dans `ngOnInit()`.
- Les données reçues sont stockées dans la propriété `pokemons`.
- Nous implémentons `OnDestroy` pour nous désabonner lorsque le composant est détruit, évitant ainsi les fuites de mémoire.

### Avantages

- Contrôle précis sur la souscription et le désabonnement.
- Possibilité de manipuler les données avant de les assigner à la propriété.

### Inconvénients

- Nécessite une gestion manuelle du désabonnement.
- Code plus verbeux.

## Approche 2 : Utilisation du Pipe Async

### Code du Composant (second commit)

```typescript
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
```

### Explications

- Nous assignons directement l'Observable à la propriété `pokemons$`.
- Le pipe `async` est utilisé dans le template pour souscrire à l'Observable.

### Avantages

- Code plus concis et déclaratif.
- Le pipe `async` gère automatiquement la souscription et le désabonnement.
- Pas besoin d'implémenter `OnDestroy`.

### Inconvénients

- Moins de contrôle direct sur la manipulation des données.
- Peut nécessiter des ajustements dans le template pour gérer les états de chargement.

## Utilisation dans le Template

Voici comment utiliser le pipe `async` dans le template avec la syntaxe moderne d'Angular 17+ :

```html
@if (pokemons$ | async; as pokemons) {
  @for (pokemon of pokemons; track pokemon.name) {
    <p>{{ pokemon.name }}</p>
  } @empty {
    <p>No Pokemons found</p>
  }
} @else {
  <p>Loading...</p>
}
```

### Explications de la nouvelle syntaxe

- `@if (pokemons$ | async; as pokemons)` : Utilise le pipe `async` pour souscrire à l'Observable et assigne le résultat à `pokemons`.
- La boucle `@for` remplace l'ancienne directive `*ngFor`.
- `track pokemon.name` optimise le rendu de la liste en fournissant une clé unique pour chaque élément.
- `@empty` gère le cas où la liste est vide.
- Le bloc `@else` gère l'état de chargement avant que les données ne soient disponibles.

## Important à Noter

- Le pipe `async` se désabonne automatiquement lorsque le composant est détruit, évitant le besoin d'un désabonnement manuel.
- La nouvelle syntaxe est plus concise, lisible, et performante.

## Conclusion

Les deux approches ont leurs mérites :
- La souscription manuelle offre plus de contrôle mais nécessite une gestion explicite.
- Le pipe `async` simplifie le code et la gestion du cycle de vie, mais peut être moins flexible pour des manipulations complexes.

Choisissez l'approche qui convient le mieux à votre cas d'utilisation spécifique. La tendance actuelle en Angular favorise l'utilisation du pipe `async` pour sa simplicité et sa gestion automatique des souscriptions.
