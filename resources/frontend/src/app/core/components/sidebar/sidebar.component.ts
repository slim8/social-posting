import { Component, Input, OnInit } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';

const dashboardIcon = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 12.5H23.5V10.5H16V12.5ZM24 13V23.5H26V13H24ZM23.5 24H16V26H23.5V24ZM15.5 23.5V13H13.5V23.5H15.5ZM2.5 2H8.5V0H2.5V2ZM9 2.5V13H11V2.5H9ZM8.5 13.5H2.5V15.5H8.5V13.5ZM2 13V2.5H0V13H2ZM2.5 13.5C2.22386 13.5 2 13.2761 2 13H0C0 14.3807 1.11929 15.5 2.5 15.5V13.5ZM9 13C9 13.2761 8.77614 13.5 8.5 13.5V15.5C9.88071 15.5 11 14.3807 11 13H9ZM8.5 2C8.77614 2 9 2.22386 9 2.5H11C11 1.11929 9.88071 0 8.5 0V2ZM2.5 0C1.11929 0 0 1.11929 0 2.5H2C2 2.22386 2.22386 2 2.5 2V0ZM2.5 20H8.5V18H2.5V20ZM9 20.5V23.5H11V20.5H9ZM8.5 24H2.5V26H8.5V24ZM2 23.5V20.5H0V23.5H2ZM2.5 24C2.22386 24 2 23.7761 2 23.5H0C0 24.8807 1.11929 26 2.5 26V24ZM9 23.5C9 23.7761 8.77614 24 8.5 24V26C9.88071 26 11 24.8807 11 23.5H9ZM8.5 20C8.77614 20 9 20.2239 9 20.5H11C11 19.1193 9.88071 18 8.5 18V20ZM2.5 18C1.11929 18 0 19.1193 0 20.5H2C2 20.2239 2.22386 20 2.5 20V18ZM16 2H23.5V0H16V2ZM24 2.5V5.5H26V2.5H24ZM23.5 6H16V8H23.5V6ZM15.5 5.5V2.5H13.5V5.5H15.5ZM16 6C15.7239 6 15.5 5.77614 15.5 5.5H13.5C13.5 6.88071 14.6193 8 16 8V6ZM24 5.5C24 5.77614 23.7761 6 23.5 6V8C24.8807 8 26 6.88071 26 5.5H24ZM23.5 2C23.7761 2 24 2.22386 24 2.5H26C26 1.11929 24.8807 0 23.5 0V2ZM16 0C14.6193 0 13.5 1.11929 13.5 2.5H15.5C15.5 2.22386 15.7239 2 16 2V0ZM16 24C15.7239 24 15.5 23.7761 15.5 23.5H13.5C13.5 24.8807 14.6193 26 16 26V24ZM24 23.5C24 23.7761 23.7761 24 23.5 24V26C24.8807 26 26 24.8807 26 23.5H24ZM23.5 12.5C23.7761 12.5 24 12.7239 24 13H26C26 11.6193 24.8807 10.5 23.5 10.5V12.5ZM16 10.5C14.6193 10.5 13.5 11.6193 13.5 13H15.5C15.5 12.7239 15.7239 12.5 16 12.5V10.5Z" fill="{{color: #FFF}}"/></svg>';
const profileIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.9696 17.5047L15.5225 18.3379L14.9696 17.5047ZM5.03036 17.5047L4.47747 18.3379L5.03036 17.5047ZM9 15H11V13H9V15ZM2 10C2 5.58172 5.58172 2 10 2V0C4.47715 0 0 4.47715 0 10H2ZM10 2C14.4183 2 18 5.58172 18 10H20C20 4.47715 15.5228 0 10 0V2ZM12 8C12 9.10457 11.1046 10 10 10V12C12.2091 12 14 10.2091 14 8H12ZM10 10C8.89543 10 8 9.10457 8 8H6C6 10.2091 7.79086 12 10 12V10ZM8 8C8 6.89543 8.89543 6 10 6V4C7.79086 4 6 5.79086 6 8H8ZM10 6C11.1046 6 12 6.89543 12 8H14C14 5.79086 12.2091 4 10 4V6ZM11 15C12.5303 15 13.7943 16.1467 13.9772 17.6273L15.9621 17.3821C15.657 14.9118 13.5525 13 11 13V15ZM18 10C18 12.7844 16.5784 15.2371 14.4167 16.6714L15.5225 18.3379C18.2189 16.5488 20 13.4826 20 10H18ZM14.4167 16.6714C13.1515 17.511 11.6344 18 10 18V20C12.0398 20 13.9397 19.3882 15.5225 18.3379L14.4167 16.6714ZM6.02282 17.6273C6.20567 16.1467 7.46968 15 9 15V13C6.44747 13 4.34299 14.9118 4.0379 17.3821L6.02282 17.6273ZM10 18C8.36561 18 6.84849 17.511 5.58326 16.6714L4.47747 18.3379C6.06034 19.3882 7.96025 20 10 20V18ZM5.58326 16.6714C3.42161 15.2371 2 12.7844 2 10H0C0 13.4826 1.78112 16.5488 4.47747 18.3379L5.58326 16.6714Z" fill="white"/></svg>';
const folderIcon = '<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13V3C1 1.89543 1.89543 1 3 1H7.58579C7.851 1 8.10536 1.10536 8.29289 1.29289L10 3H17C18.1046 3 19 3.89543 19 5V13C19 14.1046 18.1046 15 17 15H3C1.89543 15 1 14.1046 1 13Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const editIcon = '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1.99997H3C1.89543 1.99997 1 2.8954 1 3.99997V16C1 17.1045 1.89543 18 3 18H15C16.1046 18 17 17.1045 17 16V9.99997M15.4142 6.41417L16.5 5.32842C17.281 4.54737 17.281 3.28104 16.5 2.5C15.7189 1.71895 14.4526 1.71895 13.6715 2.50001L12.5858 3.58575M15.4142 6.41417L9.37795 12.4505C9.09875 12.7297 8.74315 12.9201 8.35596 12.9975L5.41422 13.5858L6.00257 10.6441C6.08001 10.2569 6.27032 9.90131 6.54951 9.62211L12.5858 3.58575M15.4142 6.41417L12.5858 3.58575" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const albumIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6C3 4.34315 4.34315 3 6 3H14C15.6569 3 17 4.34315 17 6V14C17 15.6569 15.6569 17 14 17H6C4.34315 17 3 15.6569 3 14V6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 7V18C21 19.6569 19.6569 21 18 21H7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 12.375L6.66789 8.70711C7.05842 8.31658 7.69158 8.31658 8.08211 8.70711L10.875 11.5M10.875 11.5L13.2304 9.1446C13.6209 8.75408 14.2541 8.75408 14.6446 9.14461L17 11.5M10.875 11.5L12.8438 13.4688" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const sendIcon = '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 6.31372L0.744282 5.49561C0.417352 5.5978 0.182649 5.88482 0.147406 6.22553C0.112163 6.56624 0.283148 6.89522 0.58224 7.06216L1 6.31372ZM18 1L18.8155 1.26385C18.9141 0.959006 18.8345 0.624611 18.6091 0.396932C18.3837 0.169252 18.0501 0.0863045 17.7443 0.181891L18 1ZM12.5 18L11.7437 18.4034C11.9056 18.7069 12.2332 18.8842 12.5758 18.8538C12.9184 18.8234 13.2096 18.5911 13.3155 18.2638L12.5 18ZM1.25572 7.13183L18.2557 1.81811L17.7443 0.181891L0.744282 5.49561L1.25572 7.13183ZM17.1845 0.736154L11.6845 17.7362L13.3155 18.2638L18.8155 1.26385L17.1845 0.736154ZM13.2563 17.5966L9.2563 10.0966L7.7437 10.9034L11.7437 18.4034L13.2563 17.5966ZM8.91776 9.75155L1.41776 5.56527L0.58224 7.06216L8.08224 11.2484L8.91776 9.75155ZM9.10609 11.1061L18.6061 1.60609L17.3939 0.393908L7.89391 9.89391L9.10609 11.1061Z" fill="white"/></svg>';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
    @Input() isCollapsed: boolean | undefined;
    constructor(private iconService: NzIconService) {
        this.iconService.addIconLiteral('ng-zorro:dashboard', dashboardIcon);
        this.iconService.addIconLiteral('ng-zorro:profile', profileIcon);
        this.iconService.addIconLiteral('ng-zorro:folder', folderIcon);
        this.iconService.addIconLiteral('ng-zorro:edit', editIcon);
        this.iconService.addIconLiteral('ng-zorro:album', albumIcon);
        this.iconService.addIconLiteral('ng-zorro:send', sendIcon);
    }

    ngOnInit(): void {
        const sideNav = document.querySelector('.mod-sidebar')?.parentElement?.parentElement;
        const sideNavMenu = document.querySelector('.mod-sidebar');
        sideNav?.addEventListener('mouseover', this.openSidenav);
        sideNav?.addEventListener('mouseleave', this.closeSidenav);
        sideNavMenu?.addEventListener('click', this.toggleActiveItem);
    }

    openSidenav() {
        let modMenu = document.querySelector('.mod-sidebar');
        let menu = document.querySelector('.mod-sidebar')?.parentElement?.parentElement?.parentElement;
        menu?.classList.add('is-active');
        modMenu?.classList.add('is-active');
    }

    closeSidenav() {
        let modMenu = document.querySelector('.mod-sidebar');
        let menu = document.querySelector('.mod-sidebar')?.parentElement?.parentElement?.parentElement;
        setTimeout(() => {
            menu?.classList.remove('is-active');
            modMenu?.classList.remove('is-active');
        }, 1500);
    }

    toggleActiveItem(event: any) {
        window.clearTimeout();
        if (event.target.classList.contains('m-label')) {
            const links = document.querySelectorAll('.m-label');
            links.forEach((link: any) => {
                link.parentElement.children[0].classList.remove('is-selected');
                link.classList.remove('is-selected');
            });
            event.target.parentElement.children[0].classList.add('is-selected');
            event.target.classList.add('is-selected');
        }
    }
}
