import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { fadeSlideAnimation } from '../../admin/admin.animations';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../layout/header.component';
import { SidebarComponent } from '../layout/sidebar.component';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  animations: [fadeSlideAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}