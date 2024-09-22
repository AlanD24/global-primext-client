import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

export interface UserModel {
  id: number;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
  address: String;
  phone: String;
  actions: String;
}

export type SweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

@Component({
  selector: 'app-create-edit-user',
  templateUrl: './create-edit-user.component.html',
  styleUrls: ['./create-edit-user.component.scss']
})
export class CreateEditUserComponent {

  protected userId: string | null = null;
  protected isEditing: boolean = false;
  protected userForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private userServ: UserService,
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      paternal_surname: ['', Validators.required],
      maternal_surname: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]]
    });
  }

  ngOnInit(): void {
    // Get param 'userId' from URL
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      this.isEditing = !!this.userId;

      if(this.isEditing)
        this.patchUserValues();
    });
  }

  private patchUserValues(): void {
    // Save info in global variable
    const currentState: any = this.router.lastSuccessfulNavigation?.extras?.state;
    const userSelected: UserModel = currentState?.user;

    // Patch values in formBuilder
    this.userForm.patchValue({
      name: userSelected.name,
      paternal_surname: userSelected.paternal_surname,
      maternal_surname: userSelected.maternal_surname,
      address: userSelected.address,
      phone: userSelected.phone
    });

    // Add 'id' field to form builder
    this.userForm.addControl('id', new FormControl(userSelected.id, Validators.required));
  }

  protected submitForm(): void {
    if (this.userForm.valid) {
      const userForm: UserModel = this.userForm.value;

      // If it's editing
      if(this.isEditing) {
        this.userServ.editUser(userForm).subscribe({
          next: (response: any) => {
            this.showAlert(response.message, 'success');
          },
          error: (error: any) => {
            console.error(error);
            this.showAlert(error.message, 'error');
          }
        });
        return;
      }

      // If it's creating
      this.userServ.createUser(userForm).subscribe({
        next: (response: any) => {
          this.userForm.reset(); // Clear all fields
          this.showAlert(response.message, 'success');
        },
        error: (error: any) => {
          console.error(error);
          this.showAlert(error.message, 'error');
        }
      });
    }
  }

  private showAlert(message: string, type: SweetAlertIcon): void {
    Swal.fire({
      text: message,
      icon: type,
      timer: 2000
    });
  }

  protected goBack(): void {
    this.router.navigate( ["/"] );
  }
}
