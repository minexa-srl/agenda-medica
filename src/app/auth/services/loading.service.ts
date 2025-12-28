import { Injectable } from '@angular/core'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'

import { LoaderDialogComponent } from '../../shared/components/loader-dialog/loader-dialog.component'

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private ref: DynamicDialogRef | null = null

  constructor(private dialogService: DialogService) {}

  show(message = 'Procesando...') {
    if (!this.ref) {
      this.ref = this.dialogService.open(LoaderDialogComponent, {
        showHeader: false,
        closable: false,
        modal: true,
        width: '20rem',
        contentStyle: { 'text-align': 'center', padding: '0', 'border-radius': '1rem' },
        baseZIndex: 10000,
        data: { message },
      })
    }
  }

  hide() {
    if (this.ref) {
      this.ref.close()
      this.ref = null
    }
  }
}
