import { Router } from '@angular/router';
import { NewsService } from './../../../dashboard/services/news.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  posts = [{
    id: 1,
    title: "",
    teaser: "",
    picture: "",
    date: "2022-04-05 00:00:00",
    template: '',
    createdAt: "",
    updatedAt: "",
    img : '',
    text_media_news : [{
      id: 1,
      title: "",
      subtitle: "",
      description: "",
      picture: "",
      newsId: 0,
      createdAt: "",
      updatedAt: ""
    }]
  }]

  expandSet = new Set<number>();

  constructor( private router: Router , private newsService : NewsService ) { }

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

  addNews(){
    this.router.navigate(['/application/management/create-news']);
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}
