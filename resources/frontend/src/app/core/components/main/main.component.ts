import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    isCollapsed = false;
    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.CheckStatus()
    }

    CheckStatus() {
        this.authService.checkLoggedIn().subscribe({
            next: event => {
                console.log(event)
            },
            error: err => {
                
            },
            complete: () => {
                console.log('done')
            }
        })
    }

}
