import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { InputComponent } from './components/input/input.component';

const routes: Routes = [
  { path: '', component: SettingsComponent, pathMatch: 'full' },
  { path: 'monitor', component: MonitorComponent },
  { path: 'game', component: InputComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
