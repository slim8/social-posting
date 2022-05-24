import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [],
})
export class sharedConstants {
    public static API_ENDPOINT='http://media-posting.local/api';
    public static HTTP_AUTH='Bearer';
    public static HTTP_TOKEN='token';
    public static HTTP_APPLICATION='Content-Type';
    public static HTTP_APP_JSON='application/json';
    public static HTTP_MULTI_DATAFORM='multipart/form-data';
}
