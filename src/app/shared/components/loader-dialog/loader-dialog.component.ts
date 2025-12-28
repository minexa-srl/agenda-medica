import { Component } from '@angular/core'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
  selector: 'app-loader-dialog',
  standalone: true,
  imports: [],
  templateUrl: './loader-dialog.component.html',
  styleUrl: './loader-dialog.component.scss',
})
export class LoaderDialogComponent {
  message: string

  constructor(public config: DynamicDialogConfig) {
    this.message = config.data?.message || 'Cargando...'
  }
}
