import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

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
    private readonly firebaseService: FirebaseService
  ) { }

  ngOnInit() {}

  goHome(){
    this.router.navigate(['/home']);
  }

  goCategory(){
    this.router.navigate(['/category']);
  }

  signOut(){
    this.firebaseService.signOut();
  }

}
