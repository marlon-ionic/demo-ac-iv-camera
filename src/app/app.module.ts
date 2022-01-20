import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Auth0Service } from './services/auth';
import { VaultService } from './services/auth/vault.service';

const appInitFactory =
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
    },{
        provide: APP_INITIALIZER,
        useFactory: appInitFactory,
        deps: [VaultService],
        multi: true,
      },
      Auth0Service
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
