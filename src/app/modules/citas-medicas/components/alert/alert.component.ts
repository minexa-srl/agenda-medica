/* CONTROLLER ALERT
============================================= */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TreeTableModule } from 'primeng/treetable';

import { Mensaje } from '../../models/mensaje';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, DialogModule, CardModule, TreeTableModule, ButtonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {

  /* ATTRIBUTES
  ---------------------- */
  @Output() response = new EventEmitter();
  msg!: Mensaje;
  state!: boolean;

  /* METHODS
  ---------------------- */
  show(msg: Mensaje) {
    this.msg = msg;
    this.state = true;
  }

  close() {
    this.state = false;
  }

}
