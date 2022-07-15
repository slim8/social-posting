import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
    selector: 'app-draft',
    templateUrl: './draft.component.html',
    styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit {

    posts : any[] = [];
    constructor(private postService: PostService, private router : Router) { }

    ngOnInit(): void {
        this.getPosts();
    }

    getPosts() {
        this.postService.posts().subscribe({
            next: (res: any) => {
                this.posts = res.posts;
                console.log(this.posts);
            },
            error: err => {

            },
            complete: () => {

            },
        })
    }

    edit(id : any) {
        this.router.navigate(['/home/social-accounts/'+id+'/create-post']);
    }
}
