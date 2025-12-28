/* CONTROLLER AYUDA-LIST
============================================= */
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { AyudaDetailComponent } from '../ayuda-detail/ayuda-detail.component';

@Component({
  selector: 'app-ayuda-list',
  standalone: true,
  imports: [ButtonModule, CommonModule, AyudaDetailComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './ayuda-list.component.html',
  styleUrl: './ayuda-list.component.css'
})
export class AyudaListComponent {

  /* ATTRIBUTES
  -------------------------*/
  @ViewChild(AyudaDetailComponent) detail!: AyudaDetailComponent;

  /* METHODS
  -------------------------*/
  constructor() {
  }

  showDetail(opt: number) {
    this.detail.show(opt);
  }
}
