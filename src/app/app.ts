import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Service } from '../services/service';
import { UserResponse } from '../models/user-response';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('projetTD');
  private readonly userService = inject(Service);

  name = '';
  email = '';
  gender = 'FEMALE';

  createMessage = signal('');
  createSuccess = signal(false);

  searchName = '';
  foundUser = signal<UserResponse | null>(null);
  searchError = signal('');

  addUser(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const user = {
      name: this.name,
      email: this.email,
      gender: this.gender
    };

    this.userService.createUser(user).subscribe({
      next: () => {
        this.createSuccess.set(true);
        this.createMessage.set(`User "${user.name}" was successfully created`);
        this.resetForm(form);
      },
      error: (err) => {
        console.error('Error creating user', err);
        this.createSuccess.set(false);
        this.createMessage.set('The user could not be created');
      }
    });
  }

  resetForm(form: NgForm) {
    form.resetForm({ gender: 'FEMALE' });
    this.name = '';
    this.email = '';
    this.gender = 'FEMALE';
  }

  searchUser() {
    if (!this.searchName) {
      return;
    }

    this.searchError.set('');
    this.foundUser.set(null);

    this.userService.getUserByName(this.searchName).subscribe({
      next: (user) => this.foundUser.set(user),
      error: () => this.searchError.set('No user found with this name')
    });
  }
}
