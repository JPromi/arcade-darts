import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { SettingsComponent } from './components/settings/settings.component';
import { InputComponent } from './components/input/input.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { ServiceWorkerModule } from '@angular/service-worker';

// database
const dbConfig: DBConfig = {
  name: 'darts',
  version: 1,
  objectStoresMeta: [
    {
      store: 'players',
      storeConfig: { keyPath: 'userId', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: true } }
      ]
    },
    {
      store: 'game',
      storeConfig: { keyPath: 'gameId', autoIncrement: true },
      storeSchema: [
        { name: 'gameId', keypath: 'gameId', options: { unique: true } },
        { name: 'players', keypath: 'players', options: { unique: false } },
        { name: 'mode', keypath: 'mode', options: { unique: false } },
        { name: 'checkout', keypath: 'checkout', options: { unique: false } },
        { name: 'ended', keypath: 'ended', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'throws', keypath: 'throws', options: { unique: false } }
      ]
    }
  ]
};

@NgModule({
  declarations: [
    AppComponent,
    MonitorComponent,
    SettingsComponent,
    InputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    FormsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    provideAnimationsAsync('noop')
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
