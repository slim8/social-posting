
import { NgModule } from '@angular/core';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
import { IconsProviderModule } from './icons-provider.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
// import { InstagramPreviewComponent } from './components/instagram-preview/instagram-preview.component';

@NgModule({
    declarations: [
        // InstagramPreviewComponent
      ],
    exports: [
        DemoNgZorroAntdModule,
        IconsProviderModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class SharedModule {

    constructor(private messageService: NzMessageService) { }

    createMessage(type: string, message: any): void {
        this.messageService.create(type, ` ${message}`);
    }
}
