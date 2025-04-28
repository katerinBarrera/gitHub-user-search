import { Routes } from '@angular/router';
import { IndexComponent } from './repos/index/index.component';
import { ViewComponent } from './repos/view/view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: ViewComponent },
  { path: 'search/:username', component: IndexComponent },
];
