import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEditUserRoutingModule } from './create-edit-user-routing.module';
import { CreateEditUserComponent } from './create-edit-user.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    CreateEditUserComponent,
  ],
  imports: [
    CommonModule,
    CreateEditUserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
  ]
})
export class CreateEditUserModule { }
