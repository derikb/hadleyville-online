import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RulesPageComponent } from './pages/rules-page/rules-page.component';
import { IntroPageComponent } from './pages/intro-page/intro-page.component';

const routes: Routes = [
  { path: 'rules', component: RulesPageComponent },
  { path: 'intro', component: IntroPageComponent },
  { path: '', component: HomePageComponent },
  { path: '**', component: HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
