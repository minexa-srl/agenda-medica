/* CONTROLLER AYUDA-DETAIL
============================================ */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-ayuda-detail',
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, ButtonModule],
  templateUrl: './ayuda-detail.component.html',
  styleUrl: './ayuda-detail.component.css'
})

export class AyudaDetailComponent {

  /* ATTRIBUTES
  -------------------------*/
  ayuda!: number;
  state!: boolean;

  /* METHODS
  -------------------------*/
  show(opt: number) {
    this.ayuda = opt;
    this.state = true;
  }

  close() {
    this.state = false;
  }
}
