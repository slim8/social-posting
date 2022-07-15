import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAlbumComponent } from './my-album.component';

const routes: Routes = [{ path: '', component: MyAlbumComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAlbumRoutingModule { }
