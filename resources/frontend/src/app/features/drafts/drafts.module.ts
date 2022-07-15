import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { DraftsRoutingModule } from './drafts-routing.module';
import { DraftsComponent } from './drafts.component';
import { PostItemComponent } from './components/post-item/post-item.component';


@NgModule({
  declarations: [
    DraftsComponent,
    PostItemComponent
  ],
  imports: [
    CommonModule,
    DraftsRoutingModule,
    SharedModule
  ]
})
export class DraftsModule { }
