import { Injectable, NgZone } from '@angular/core';
import { IonicAuth } from '@ionic-enterprise/auth';
import { NavController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VaultService } from './vault.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class Auth0Service extends IonicAuth{
  authState$: Observable<boolean>;
  private authState: BehaviorSubject<boolean>;
  private navController: NavController;

  constructor(navController: NavController, platform: Platform, private storage: Storage,
              vaultService: VaultService, private zone: NgZone) {
    super({
      ...environment.auth0,
      platform: platform.is('capacitor') ? 'capacitor' : 'web',
      redirectUri: (platform.is('capacitor') ? environment.appHost : environment.webHost) + 'login',
      logoutUrl: (platform.is('capacitor') ? environment.appHost : environment.webHost) + 'login',
      tokenStorageProvider: vaultService.vault
    });
    this.authState  = new BehaviorSubject(false);
    this.authState$ = this.authState.asObservable();
    this.navController = navController;
    this.initState();
  }

  async isAuthenticated(): Promise<boolean> {
    const isAuth = await super.isAuthenticated();
    this.zone.run(async () => {
      this.setState(isAuth);
    });
    return isAuth;
  }

  async onLoginSuccess(): Promise<void> {
    this.zone.run(async () => {
      this.setState(true);
      await this.navController.navigateRoot('', {animated: false});
    });
  }

  async onLogout(): Promise<void> {
    this.zone.run(async () => {
      this.setState(false);
      await this.navController.navigateRoot('/login', {animated: false});
    });
  }

  private async initState(): Promise<void> {
    const isLoggedIn = await this.storage.get('auth0');
    this.authState.next(!!isLoggedIn);
  }

  private async setState(currentState: boolean): Promise<void> {
    await this.storage.set('auth0', currentState);
    this.authState.next(currentState);
  }
}
