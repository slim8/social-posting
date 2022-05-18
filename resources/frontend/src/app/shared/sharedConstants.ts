import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [],
})
export class sharedConstants { 
    public static API_ENDPOINT='http://posting.local/api';
    public static HTTP_AUTH='Bearer';
    public static HTTP_TOKEN='token';
    public static HTTP_APPLICATION='Content-Type';
    public static HTTP_CONTENT='application/json';
}
