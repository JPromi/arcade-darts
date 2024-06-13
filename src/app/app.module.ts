import { NgModule } from '@angular/core';
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
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

// database
const dartsDbConfig: DBConfig = {
  name: 'darts',
  version: 2,
  objectStoresMeta: [
    {
      store: 'user',
      storeConfig: { keyPath: 'userId', autoIncrement: true},
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: true } },
      ]
    },
    {
      store: 'darts',
      storeConfig: { keyPath: 'dartsId', autoIncrement: true},
      storeSchema: [
        { name: 'mode', keypath: 'mode', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'checkout', keypath: 'checkout', options: { unique: false } },
        { name: 'ended', keypath: 'ended', options: { unique: false } },
        { name: 'players', keypath: 'players', options: { unique: false } },
        { name: 'throws', keypath: 'throws', options: { unique: false } },
      ]
    },
    {
      store: 'checkout_lookup',
      storeConfig: { keyPath: 'checkoutId', autoIncrement: true},
      storeSchema: [
        { name: 'points', keypath: 'points', options: { unique: true } },
        { name: 'hint1', keypath: 'checkout', options: { unique: false } },
        { name: 'hint2', keypath: 'hint2', options: { unique: false } },
        { name: 'hint3', keypath: 'hint3', options: { unique: false } },
      ]
    }
  ]
}

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
    NgxIndexedDBModule.forRoot(dartsDbConfig),
  ],
  providers: [
    provideAnimationsAsync('noop')
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
