import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoNgZorroAntdModule } from './../../shared/ng-zorro-antd.module';
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
    MyAlbumRoutingModule,
    DemoNgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule ,
  ]
})
export class MyAlbumModule { }
