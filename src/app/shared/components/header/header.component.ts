import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() contentId!: string;

  constructor(
    private readonly router: Router,
  ) { }

  ngOnInit() {}

  goHome(){
    this.router.navigate(['/home']);
  }

  goCategory(){
    this.router.navigate(['/category']);
  }

}
