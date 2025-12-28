/* CONTROLLER MENU-CONSULTORIO
============================================= */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app-menu-consultorio',
  standalone: true,
  imports: [DialogModule, CommonModule, CardModule, TreeTableModule, ButtonModule, DialogModule],
  templateUrl: './menu-consultorio.component.html',
  styleUrls: ['./menu-consultorio.component.scss'],
})
export class MenuConsultorioComponent {

  /* ATTRIBUTES
  ---------------------- */
  @Output() response = new EventEmitter<number>();
  state!: boolean;

  /* METHODS
  ---------------------- */
  show() {
    this.state = true;
  }

  option(type: number) {
    this.state = false;
    this.response.emit(type)
  }
}
