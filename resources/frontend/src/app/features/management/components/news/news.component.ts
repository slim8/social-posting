import { NzModalService } from 'ng-zorro-antd/modal';
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
    text:"",
    textImage:""
  }]

  expandSet = new Set<number>();

  constructor( private router: Router , private newsService : NewsService , private modal: NzModalService ) { }

  ngOnInit(): void {

    this.getNewsList();

  }

  getNewsList(){
    this.newsService.getNewsList().subscribe({
      next: (event: any) => {
          this.posts = event.news.map((item : any) => ({...item , img : JSON.parse(item.picture).url }));
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

  editNews(id : number ){
    this.router.navigate(['/application/management/edit-news' , id]);
  }

  deleteNews(id : number , title : string){
    this.modal.confirm({
      nzTitle: '<i>Do you Want to remove this news ?</i>',
      nzContent: '<b>'+ title + '</b>',
      nzOnOk: () => {
        this.newsService.deleteNews(id).subscribe({
          next: (event: any) => {
              this.getNewsList();
            },
          error: err => {

          },
          complete: () => {
          }
        })
      }
    });

  }
}
