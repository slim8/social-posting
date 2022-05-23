
import { NgModule } from '@angular/core';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
import { IconsProviderModule } from './icons-provider.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    exports: [
        DemoNgZorroAntdModule,
        IconsProviderModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class SharedModule {

}
