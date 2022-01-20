import { Component, OnDestroy, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Auth0Service } from '../services/auth';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit, OnDestroy {
  private loader?: HTMLIonLoadingElement;

  constructor(private authService: Auth0Service,
              private loadingController: LoadingController,
              private navController: NavController,
              private alertController: AlertController) { }

  async ngOnDestroy() {
    await this.toggleLoader(false);
  }

  async ionViewWillLeave(){
    await this.toggleLoader(false);
  }

  async ngOnInit() {
    await this.login();
  }

  private async login() {
    await this.toggleLoader();
    const isAuth = await this.authService.isAuthenticated();
    if(isAuth) {
      await this.navController.navigateRoot('', { animated: false});
    } else {
      try {
        await this.authService.login();
      } catch(e) {
        console.log('login error', JSON.stringify(e));
        const alert = await this.alertController.create({
          header: 'Login Failed',
          message: 'Encountered an error while logging. Please try again to continue',
          buttons: [
            {
              text: 'Retry Login',
              handler: async () => await this.login()
            }
          ]
        });
        await alert.present();
      } finally {
        await this.toggleLoader(false);
      }
    }
  }

  private async toggleLoader(isLoading = true, message?: string) {
    if(!isLoading) {
      await this.loader?.dismiss();
      return;
    }
    if(this.loader === undefined) {
      this.loader = await this.loadingController.create({message});
      await this.loader.present();
    }
  }

}
