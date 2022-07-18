import { NewsService } from './../../services/news.service';
import { NzIconService } from 'ng-zorro-antd/icon';
import { Component, OnInit } from '@angular/core';

const showViewIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.14286 4C6.69514 4 7.14286 3.55228 7.14286 3C7.14286 2.44772 6.69514 2 6.14286 2V4ZM14 9.21429C14 8.662 13.5523 8.21429 13 8.21429C12.4477 8.21429 12 8.662 12 9.21429H14ZM15 1H16C16 0.447715 15.5523 0 15 0V1ZM11 0C10.4477 0 10 0.447715 10 1C10 1.55228 10.4477 2 11 2V0ZM14 5C14 5.55228 14.4477 6 15 6C15.5523 6 16 5.55228 16 5H14ZM4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L4.29289 10.2929ZM11 14H3V16H11V14ZM2 13V5H0V13H2ZM3 4H6.14286V2H3V4ZM12 9.21429V13H14V9.21429H12ZM3 14C2.44772 14 2 13.5523 2 13H0C0 14.6569 1.34315 16 3 16V14ZM11 16C12.6569 16 14 14.6569 14 13H12C12 13.5523 11.5523 14 11 14V16ZM2 5C2 4.44772 2.44772 4 3 4V2C1.34315 2 0 3.34315 0 5H2ZM15 0H11V2H15V0ZM14 1V5H16V1H14ZM5.70711 11.7071L15.7071 1.70711L14.2929 0.292893L4.29289 10.2929L5.70711 11.7071Z" fill="black" fill-opacity="0.3"/></svg>';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss']
})
export class BlogPostsComponent implements OnInit {

  posts = [{
    id: 1,
    title: "",
    teaser: "",
    picture: "",
    date: "2022-04-05 00:00:00",
    template: '',
    createdAt: "",
    updatedAt: "",
    img : ''
    }
  ]

  constructor(
    private iconService: NzIconService, private newsService : NewsService
  ) {
    this.iconService.addIconLiteral('ng-zorro:show-view', showViewIcon);
  }

  ngOnInit(): void {

    this.newsService.getNewsList().subscribe({
      next: (event: any) => {
          console.log(event);
          this.posts = event.news.map((item : any) => ({...item , img : JSON.parse(item.picture).url}));
        },
      error: err => {
        
      },
      complete: () => {
      }
    })
  }

}
