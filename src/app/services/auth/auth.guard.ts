import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Auth0Service } from '.';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: Auth0Service, private router: Router) {}

  async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    console.log('AuthGuard.canActivateChild');
    return await this.canActivate(childRoute, state);
  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
      const isAuth = await this.authService.isAuthenticated();
      console.log('AuthGuard.isAuth', isAuth);
      if(!isAuth) {
        return this.router.parseUrl('/landing');
      }
    return true;
  }
}
