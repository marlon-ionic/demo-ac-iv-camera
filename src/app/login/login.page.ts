import { Component, OnDestroy, OnInit } from '@angular/core';
import { Device } from '@ionic-enterprise/identity-vault';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Auth0Service } from '../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  loginSuccessSubscription?: Subscription;
  constructor(private authService: Auth0Service, private navController: NavController) { }

  ngOnInit() {
    // this.loginSuccessSubscription = this.authService.loginSuccess$.subscribe(_ => this.navController.navigateRoot(['home']));
  }

  ngOnDestroy(): void {
      this.loginSuccessSubscription?.unsubscribe();
  }

  async login() {
    console.log('LoginPage.login()');
    try {
      console.log('LoginPage.login() try');
      // this.authService.setLoadingStatus(true);

      // https://ionic.io/docs/auth-connect/securing-tokens#handling-privacy-screens
      await Device.setHideScreenOnBackground(false);
      await this.authService.login();
      await Device.setHideScreenOnBackground(true);
    } catch(e) {
      await this.navController.navigateRoot(['/login'], {animated: false});
    } finally {
      console.log('LoginPage.login() finally');
      // this.authService.setLoadingStatus(false);
    }

  }

}
