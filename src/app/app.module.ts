import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Auth0Service } from './services/auth';
import { VaultService } from './services/auth/vault.service';

const storageInitFactory =
  (storage: Storage): (() => Promise<Storage>) =>
  async () => await storage.create();

const vaultServiceInitFactory =
  (vaultService: VaultService): (() => Promise<void>) =>
  async () => await vaultService.init();

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: APP_INITIALIZER,
      useFactory: storageInitFactory,
      deps: [Storage],
      multi: true,
    },
    {
        provide: APP_INITIALIZER,
        useFactory: vaultServiceInitFactory,
        deps: [VaultService],
        multi: true,
      },
      Auth0Service
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
