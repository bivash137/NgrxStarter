import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from './store/models/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { loadUsers, updateUser, patchUser } from './store/actions/user.actions';
import { selectUsers, selectLoading, selectError } from './store/selectors/user.selectors';
import { UserService } from '../services/user.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users: any[] = [];
  editUserId: number | null = null;
  userForms: { [key: number]: FormGroup } = {};
  originalUserData: { [key: number]: User } = {}; // Store original user data
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  constructor(private store: Store, private userService: UserService) {}

  ngOnInit() {
    this.store.dispatch(loadUsers());
    this.store.select(selectUsers).subscribe((users) => {
      console.log('Current State:', users);
      this.users = users;
      this.userInitForms();
    });
  }

  // Initialize User forms for each user with explicit FormControl types
  userInitForms() {
    this.users.forEach((user) => {
      this.userForms[user.id] = new FormGroup({
        name: new FormControl(user.name),
        username: new FormControl(user.username),
        email: new FormControl(user.email),
      });
      this.originalUserData[user.id] = { ...user }; // Store original data
    });
  }

  // Helper method to get form control
  getFormControl(userId: number, controlName: string): FormControl {
    return this.userForms[userId].get(controlName) as FormControl;
  }

  // Enable editing mode and reset form with existing values
  editUser(id: number) {
    if (this.editUserId === id) {
      // Reset form controls with the selected user's current data
      this.userForms[id].reset({
        name: this.originalUserData[id].name,
        username: this.originalUserData[id].username,
        email: this.originalUserData[id].email,
      });
      this.editUserId = null;
    } else {
      this.userService.getUserById(id).subscribe((user) => {
        this.userForms[id].setValue({
          name: user.name,
          username: user.username,
          email: user.email,
        });
        this.originalUserData[id] = { ...user }; // Update stored original data
        this.editUserId = id; // Enable edit mode for this row
      });
    }
  }

  // Save user updates
  saveUser(id: number) {
    if (!this.userForms[id]) return;
    const updatedUser = { ...this.userForms[id].value, id };
   
    const changedFields: Partial<User> = Object.fromEntries(
      (Object.keys(updatedUser) as (keyof User)[])
        .filter(key => updatedUser[key] !== this.originalUserData[id][key])
        .map(key => [key, updatedUser[key]])
    );
    Object.keys(changedFields).length < Object.keys(updatedUser).length - 1
      ? this.store.dispatch(patchUser({ id, changes: changedFields }))
      : this.store.dispatch(updateUser({ user: updatedUser }));
  
    this.originalUserData[id] = { ...updatedUser };
    this.editUserId = null;
  }
}