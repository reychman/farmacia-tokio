import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Indexeddb } from './core/services/indexeddb';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  constructor(private idb: Indexeddb) {}

  ngOnInit(): void {
    this.idb.initDB().then(() => {
      console.log('IndexedDB Farmacia Tokio inicializada correctamente');
    });
  }
}