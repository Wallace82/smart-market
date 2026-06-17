import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-campaign-form-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './campaign-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignFormDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CampaignFormDialogComponent>);
  private dialogData = inject(MAT_DIALOG_DATA, { optional: true });

  public campaignForm: FormGroup;
  public isSubmitting = signal(false);

  constructor() {
    this.campaignForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      segmento: ['', [Validators.required, Validators.minLength(2)]],
      raio: ['3 km', [Validators.required]]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.campaignForm.valid) {
      const formVal = this.campaignForm.value;
      const result = {
        supermercadoId: this.dialogData?.supermercadoId,
        nome: formVal.nome,
        segmento: formVal.segmento,
        raio: formVal.raio,
        status: 'Ativa'
      };
      this.dialogRef.close(result);
    }
  }
}
