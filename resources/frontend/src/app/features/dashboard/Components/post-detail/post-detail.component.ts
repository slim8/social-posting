import { NewsService } from './../../services/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

  news = {
    id: 1,
    title: "",
    teaser: "",
    picture: "",
    date: "2022-04-05 00:00:00",
    template: '',
    createdAt: "",
    updatedAt: "",
    img : '',
    newsText:"",
    textImage:""
  }

  constructor(private newsService : NewsService ,private route: ActivatedRoute ,private router: Router) { }

  ngOnInit(): void {
    this.getNews(this.route.snapshot.paramMap.get('id'))
  }

  getNews(news : any){
    this.newsService.getNewsById(news).subscribe({
      next: (event: any) => {
        if(event.new){
          this.news = {...event.new , img : JSON.parse(event.new.picture).url, textImage : JSON.parse(event.new.textImage).url};
        }else{
          this.router.navigate(['/application/dashboard/blog-posts'])
        }
      }
    })
  }

}
