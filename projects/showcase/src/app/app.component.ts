import { Component, OnInit } from '@angular/core';
import { Author, AuthorService } from './services/author.service';
import { Observable } from 'rxjs';
import { map, switchAll, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'showcase';
  authors$: Observable<Author[]>;
  lastId;

  constructor(protected authorService: AuthorService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.authors$ = this.findAuthors();
  }

  findAuthors(): Observable<Author[]> {
    return this.authorService.find().pipe(
      tap((auth) => {
        this.lastId = auth.length;
      })
    );
  }

  addAuthor() {
    const id = this.lastId + 1;
    this.authors$ = this.authorService
      .add({
        id,
        name: `author ${id}`,
      })
      .pipe(switchMap(() => this.findAuthors()));
  }

  getLastAuthor() {
    this.authors$ = this.authorService
      .get(this.lastId)
      .pipe(map((auth) => [auth]));
  }

  updateLastAuthor() {
    const id = this.lastId;
    this.authors$ = this.authorService
      .update(id, {
        id,
        name: `author${id + 1}`,
      })
      .pipe(switchMap(() => this.findAuthors()));
  }

  deleteLastAuthor() {
    this.authors$ = this.authorService
      .delete(this.lastId)
      .pipe(switchMap(() => this.findAuthors()));
  }
}
