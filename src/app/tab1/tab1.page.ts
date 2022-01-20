import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Auth0Service } from '../services/auth';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  email: string;
  picture?: string;
  capturedImage: Photo;
  sanitizedImageUrl?: SafeResourceUrl;

  constructor(private authService: Auth0Service, private sanitizer: DomSanitizer ) {}

  async ngOnInit(): Promise<void> {
    const idToken = await this.authService.getIdToken();
    this.email = idToken?.email;
    this.picture = idToken?.picture;
    console.log('id token', idToken);
  }

  ngOnDestroy(): void {
    this.capturedImage = undefined;
  }



  async takePicture() {
    try {
      await this.authService.updateUnlockTimeout(null);
      this.capturedImage = await Camera.getPhoto({
        quality: 75,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });
      this.sanitizedImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.capturedImage.webPath);
      console.log('image', this.capturedImage, this.sanitizedImageUrl,'bypassSecurityTrustResourceUrl');
    } catch(e) {
      console.log('getPhoto error', JSON.stringify(e));
      this.capturedImage = undefined;
      this.sanitizedImageUrl = undefined;
    } finally {
      await this.authService.updateUnlockTimeout(1000);
    }
  }

  async logout() {
    await this.authService.logout();
  }

}
