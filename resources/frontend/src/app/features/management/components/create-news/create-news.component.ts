import { Router } from '@angular/router';
import { NewsService } from './../../../dashboard/services/news.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']
})
export class CreateNewsComponent implements OnInit {


    title: string ="";
    teaser: string = "";
    picture: string = "";
    date: string =  "2022-04-05 00:00:00";
    template: string = '';
    image : File | null = null;

  error : any = null ;

  constructor( private newsService : NewsService , private router : Router) { }

  ngOnInit(): void {
  }

  loadFile(event : Event){
    let target = event.target as HTMLInputElement;
    if(target.files)
    this.image = target.files[0] ; 
    // console.log(target.files[0]);
    
  }

  saveProfile(){
    
    this.error = null ;
    let data = {
      title : this.title,
      teaser : this.teaser, 
      image : this.picture, 
      date : this.date , 
      template : this.template 
    };
    console.log( data );
    let formData = new FormData();
    formData.append('title',this.title);
    formData.append('teaser',this.teaser);
    if(this.image)
    formData.append('image',this.image);
    formData.append('date',this.date);
    formData.append('template',this.template);

    this.newsService.addNews(formData).subscribe({
      next: (event: any) => {
          this.router.navigate(['/application/management/news']);
          console.log(event);
          
        },
      error: err => {
          console.log(err);
          this.error = err.error.error;
      },
      complete: () => {
      }
    })
  }

}
