import { Component, OnDestroy, OnInit } from '@angular/core';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Auth0Service } from '../services/auth';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  email: string;
  password: string;
  isVaultLocked = false;
  hasSession = false;
  capturedImage: Photo;

  constructor(private authService: Auth0Service) {}

  async ngOnInit(): Promise<void> {
    const idToken = await this.authService.getIdToken();
    this.email = idToken?.email;
    console.log('id token', idToken);
  }

  ngOnDestroy(): void {
    this.capturedImage = undefined;
  }



  async takePicture() {
    try {
      // this.auth.shouldAuthCheckOnResume = false;
      this.capturedImage = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });
      console.log('image', this.capturedImage);
    } catch(e) {
      console.log('getPhoto error', JSON.stringify(e));
      this.capturedImage = undefined;
    } finally {
      // this.auth.shouldAuthCheckOnResume = true;
    }
  }

  async logout() {
    await this.authService.logout();
  }

}
