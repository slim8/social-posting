import { Component, Input, OnInit } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';


const externalLinkIcon = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.60714 3C5.02136 3 5.35714 2.66421 5.35714 2.25C5.35714 1.83579 5.02136 1.5 4.60714 1.5V3ZM10.5 6.91071C10.5 6.4965 10.1642 6.16071 9.75 6.16071C9.33579 6.16071 9 6.4965 9 6.91071H10.5ZM11.25 0.75H12C12 0.335786 11.6642 0 11.25 0V0.75ZM8.25 0C7.83579 0 7.5 0.335786 7.5 0.75C7.5 1.16421 7.83579 1.5 8.25 1.5V0ZM10.5 3.75C10.5 4.16421 10.8358 4.5 11.25 4.5C11.6642 4.5 12 4.16421 12 3.75H10.5ZM3.21967 7.71967C2.92678 8.01256 2.92678 8.48744 3.21967 8.78033C3.51256 9.07322 3.98744 9.07322 4.28033 8.78033L3.21967 7.71967ZM8.25 10.5H2.25V12H8.25V10.5ZM1.5 9.75V3.75H0V9.75H1.5ZM2.25 3H4.60714V1.5H2.25V3ZM9 6.91071V9.75H10.5V6.91071H9ZM2.25 10.5C1.83579 10.5 1.5 10.1642 1.5 9.75H0C0 10.9926 1.00736 12 2.25 12V10.5ZM8.25 12C9.49264 12 10.5 10.9926 10.5 9.75H9C9 10.1642 8.66421 10.5 8.25 10.5V12ZM1.5 3.75C1.5 3.33579 1.83579 3 2.25 3V1.5C1.00736 1.5 0 2.50736 0 3.75H1.5ZM11.25 0H8.25V1.5H11.25V0ZM10.5 0.75V3.75H12V0.75H10.5ZM4.28033 8.78033L11.7803 1.28033L10.7197 0.21967L3.21967 7.71967L4.28033 8.78033Z" fill="black"/></svg>';

@Component({
    selector: 'app-collapse-item',
    templateUrl: './collapse-item.component.html',
    styleUrls: ['./collapse-item.component.scss']
})
export class CollapseItemComponent implements OnInit {
    @Input() item: any;
    public isCollapsed = false;
    constructor(private iconService: NzIconService) {
        this.iconService.addIconLiteral('ng-zorro:external-link', externalLinkIcon);
    }

    ngOnInit(): void {
    }

    collapse() {
        this.isCollapsed = !this.isCollapsed;
    }
}
