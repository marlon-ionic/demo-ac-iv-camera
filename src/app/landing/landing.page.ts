import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Auth0Service } from '../services/auth';


/*
LandingPage is an interstital that provides the user status while the auth action is happening.
The messaging and error handling for login all happens here
Once login is successful, the authService handles routing
the user to the default route by passing '' (in this case, will redirect to '/tabs/tab1')
*/
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {

  //Used to toggle of the spinner
  isLoading = true;

  //Used to provide specific details of the action happening at a given moment
  loadingStatus?: string = 'Checking your login status';

  //Could be removed if you don't want to use the loadingController
  private loader?: HTMLIonLoadingElement;

  constructor(private authService: Auth0Service,
              private loadingController: LoadingController,
              private navController: NavController,
              private alertController: AlertController) { }

  async ionViewDidLeave(){
    await this.toggleLoader(false);
    this.isLoading = true;
    this.loadingStatus = 'Checking your login status';
  }

  async ionViewWillEnter(){
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
        await this.toggleLoader(true, 'Setting up your session');
      } catch(e) {
        console.log('login error', JSON.stringify(e));
        await this.toggleLoader(false, e?.message || 'Login failed to complete');

        //Present an alert to retry login
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
      }
    }
  }


  private async toggleLoader(isLoading = true, message?: string) {
    this.isLoading = isLoading;
    this.loadingStatus = message;
    // Could also use a loadingController with some slight tweaks.
    // See stub code below.
    /*
    if(!isLoading) {
      await this.loader?.dismiss();
      return;
    }
    if(this.loader === undefined) {
      this.loader = await this.loadingController.create({message});
      await this.loader.present();
    }
    */
  }

}
