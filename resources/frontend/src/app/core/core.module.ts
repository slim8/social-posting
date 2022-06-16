import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { DemoNgZorroAntdModule } from '../shared/ng-zorro-antd.module';
import { RouterModule } from '@angular/router';
import { IconsProviderModule } from '../shared/icons-provider.module';
import { CoreRoutingModule } from './core-routing.module';
import { PremiumComponent } from './components/premium/premium.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    MainComponent,
    PremiumComponent,

  ],
  imports: [CommonModule, DemoNgZorroAntdModule, IconsProviderModule, RouterModule, CoreRoutingModule],
  exports: [MainComponent],
})
export class CoreModule {}
