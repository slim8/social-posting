import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FacebookSocialService} from "../../services/facebook-social.service";

@Component({
  selector: 'app-accounts-posts',
  templateUrl: './accounts-posts.component.html',
  styleUrls: ['./accounts-posts.component.scss']
})
export class AccountsPostsComponent implements OnInit {
  listPosts:any;

  constructor(private facebookSocialService: FacebookSocialService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.getPostsByPageId();
  }

  getPostsByPageId(){
    let id=atob(this.activatedRoute.snapshot.params["id"]);
    this.facebookSocialService.getPostsBypageId(id).subscribe({
      next: (response: any) => {
        this.listPosts=response.posts;
      },
      error: err => {
          console.warn(err);
      },
      complete: () => {
      }
    })
  }
}
