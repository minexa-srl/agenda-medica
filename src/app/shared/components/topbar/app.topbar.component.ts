import { NgClass } from '@angular/common'
import { Component, ElementRef, ViewChild } from '@angular/core'
import { RouterLink } from '@angular/router'

import { AppComponent } from 'src/app/app.component'

import { AppMenuItem } from '../../models/app-menu-item'
import { LayoutService } from '../../services/app.layout.service'
@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  standalone: true,
  imports: [RouterLink, NgClass, AppComponent],
})
export class AppTopBarComponent {
  @ViewChild('menubutton') menuButton!: ElementRef

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef

  @ViewChild('topbarmenu') menu!: ElementRef

  items!: AppMenuItem[]

  constructor(
    public layoutService: LayoutService,
    public app: AppComponent,
  ) {}

  get user() {
    return this.app.identityClaims as { name?: string; username?: string } | null
  }
}
