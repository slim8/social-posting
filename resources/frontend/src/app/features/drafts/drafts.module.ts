import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DraftsRoutingModule } from './drafts-routing.module';
import { DraftsComponent } from './drafts.component';


@NgModule({
  declarations: [
    DraftsComponent
  ],
  imports: [
    CommonModule,
    DraftsRoutingModule
  ]
})
export class DraftsModule { }
