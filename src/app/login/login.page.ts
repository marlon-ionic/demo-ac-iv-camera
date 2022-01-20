import { Component, OnDestroy, OnInit } from '@angular/core';
import { Device } from '@ionic-enterprise/identity-vault';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Auth0Service } from '../services/auth';


/*
LoginPage is a simple route to be a destination after a logout action has occurred.
Although this could be rolled into the landing page, its best to keep seperate
*/
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(private navController: NavController) { }

  async login() {
    // https://ionic.io/docs/auth-connect/securing-tokens#handling-privacy-screens
    await Device.setHideScreenOnBackground(false);
    await this.navController.navigateRoot(['/landing'], {animated: false});
    await Device.setHideScreenOnBackground(true);
  }

}
