import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    isAuthenticated:boolean = true 

    constructor(
        private authService: AuthService,
        private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.authService.checkLoggedIn().subscribe({
            next: (event: any) => {
                this.isAuthenticated = true
            },
            error: err => {
                this.router.navigate(['/auth/login']);
            },
            complete: () => {

            }
        })

        return this.isAuthenticated;
    }
}
