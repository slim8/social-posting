import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
  @Input() post: any =  [];
  @Output() newItemEvent = new EventEmitter<any[]>();
  @Input() draftsList: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  check(event:any, value:string) {
   if(event.target.checked) {
         if(!this.draftsList.includes(value)) {
             this.draftsList.push(value);
         }
     } else {
         if(this.draftsList.includes(value)) {
             let index = this.draftsList.indexOf(value);
             this.draftsList.splice(index, 1);
         }
     }

   console.log(this.draftsList);
  }
updateList() {
   this.newItemEvent.emit(this.draftsList);
}

}
