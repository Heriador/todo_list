import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from '../home/home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { TodoCardComponent } from './components/todo-card/todo-card.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule
  ],
  declarations: [HomePage,TodoCardComponent]
})
export class HomePageModule {}
