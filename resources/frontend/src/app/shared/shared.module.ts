
import { NgModule } from '@angular/core';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
import { IconsProviderModule } from './icons-provider.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';

@NgModule({
    declarations: [
        NotFoundComponent,
        ServerErrorComponent,
        UnauthorizedComponent
    ],
    imports: [
        DemoNgZorroAntdModule
    ],
    exports: [
        DemoNgZorroAntdModule,
        IconsProviderModule,
        FormsModule,
        ReactiveFormsModule,

        NotFoundComponent,
        ServerErrorComponent,
        UnauthorizedComponent
    ]
})
export class SharedModule {

    constructor(private messageService: NzMessageService) { }

    createMessage(type: string, message: any): void {
        this.messageService.create(type, ` ${message}`);
    }

}
