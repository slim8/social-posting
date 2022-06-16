import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAlbumRoutingModule } from './my-album-routing.module';
import { MyAlbumComponent } from './my-album.component';


@NgModule({
  declarations: [
    MyAlbumComponent
  ],
  imports: [
    CommonModule,
    MyAlbumRoutingModule
  ]
})
export class MyAlbumModule { }
