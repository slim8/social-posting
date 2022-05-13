import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input () isCollapsed: boolean | undefined;
  @Output() newCollapseEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed
    this.newCollapseEvent.emit(this.isCollapsed);
  }

}
