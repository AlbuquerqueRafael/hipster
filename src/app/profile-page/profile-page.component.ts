import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfilePageComponent implements OnInit {

  profile: any;
  events: [any];
  selected_tab: number = 0;

  constructor(private sanitizer: DomSanitizer,
              private route: ActivatedRoute) {


               }

  ngOnInit() {
    this.route.params.subscribe(params => {
        let username = params['username'];
        this.profile = {
          username: username,
          youtube: username,
          spotify: username,
          email: "hipster@gmail.com",
          data_nascimento: "01/06/1990",
          data_criacao: "13/11/2017"
        }


     });

     this.events = [
       {
         title: "Rafael's Song",
         date: "2 days ago",
         likes: "41 Likes"
       },
       {
         title: "Gilekel's Song",
         date: "4 days ago",
         likes: "31 Likes"
       },
       {
         title: "Mafraboy's Song",
         date: "5 days ago",
         likes: "67 Likes"
       },
     ]

  }
}
