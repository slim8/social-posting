import { DemoNgZorroAntdModule } from './../../shared/ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { DictionairiesComponent } from './components/dictionairies/dictionairies.component';


@NgModule({
  declarations: [
    DictionairiesComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule ,
    DemoNgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule ,
  ]
})
export class AdministrationModule { }
