import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  success(message: string, action: string = 'OK') {
    this.snackBar.open(message, action, {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['smart-toast-success']
    });
  }

  error(message: string, action: string = 'FECHAR') {
    this.snackBar.open(message, action, {
      duration: 6000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['smart-toast-error']
    });
  }

  warn(message: string, action: string = 'ENTENDI') {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['smart-toast-warning']
    });
  }
}
