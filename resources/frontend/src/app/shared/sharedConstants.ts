import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [],
})
export class sharedConstants { 
    public static API_ENDPOINT='http://posting.local/api';
}
