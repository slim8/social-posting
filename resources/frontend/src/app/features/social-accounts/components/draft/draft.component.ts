import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
    selector: 'app-draft',
    templateUrl: './draft.component.html',
    styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit {

    posts : any[] = [];
    constructor(private postService: PostService) { }

    ngOnInit(): void {
        this.getPosts();
    }

    getPosts() {
        this.postService.posts().subscribe({
            next: (res: any) => {
                this.posts = res.posts;
            },
            error: err => {
                
            },
            complete: () => {
                
            },
        })
    }
}
