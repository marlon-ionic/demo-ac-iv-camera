import { Component, NgZone, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Auth0Service } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private isAuthUrl = false;
  private loader?: HTMLIonLoadingElement;
  constructor(
    private storage: Storage,
    private authService: Auth0Service,
    private navController: NavController,
    private loadingContoller: LoadingController,
    private zone: NgZone
  ) {}

  async ngOnInit() {
    //Apply App Listeners AfterViewInit to ensure the app is already running before begining to listen
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
      // https://capacitorjs.com/docs/guides/angular
      this.zone.run(async () => {
        if (isActive) {
          // await this.checkForAuth();
        }
      });
    });

    App.addListener('appUrlOpen', (data) => {
      this.zone.run(() => {
        console.log('App opened with URL:', data);
        this.isAuthUrl = data?.url?.indexOf('code=') > -1;
      });
    });

    App.addListener('appRestoredResult', (data) => {
      this.zone.run(() => {
        console.log('App Restored state:', data);
      });
    });
  }

  async ionViewWillLeave() {
    await this.loader?.dismiss();
  }

  async checkForAuth() {
    if (this.isAuthUrl) {
      console.log('checkForAuth - skipping');
      this.isAuthUrl = false;
      return;
    }
    console.log('checkForAuth');
    if (!this.loader) {
      this.loader = await this.loadingContoller.create({
        message: 'Checking your login status',
      });
    }
    this.loader?.present();
    this.zone.run(async () => {
      let isAuth = false;
      try {
        isAuth = await this.authService.isAuthenticated();
      } catch (e) {
        // RARE: If the auth check fails for some reason
        console.log('error isAuthenticated', e);
      } finally {
        const ref = this.loader || (await this.loadingContoller.getTop());
        await ref?.dismiss();
        console.log('checkForAuth? isAuth', isAuth);
        if (!isAuth) {
          await this.navController.navigateRoot('/login', { animated: false });
        }
      }
    });
  }
}
