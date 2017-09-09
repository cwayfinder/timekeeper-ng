import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ThingComponent } from './thing/thing.component';
import { ContextComponent } from './context/context.component';
import { ActivityComponent } from './activity/activity.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'thing', component: ThingComponent },
      { path: 'context', component: ContextComponent },
      { path: 'activity', component: ActivityComponent },
      { path: 'project', component: ProjectComponent },
    ]
  },

  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
