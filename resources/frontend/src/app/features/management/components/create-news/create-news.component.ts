import { Router, ActivatedRoute } from '@angular/router';
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

  editMode = false ;
  newsEditId :string | null =  null;

  constructor( private newsService : NewsService , private router : Router , private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.newsEditId = this.route.snapshot.paramMap.get('id');
    if(this.newsEditId) {
      this.editMode = true ;
      this.getNewsToEdit(this.newsEditId);
    }

  }

  getNewsToEdit(news : any){
    this.newsService.getNewsById(news).subscribe({
      next: (event: any) => {
          this.title = event.new.title;
          this.teaser  = event.new.teaser;
          this.date =  event.new.date;
          this.template = event.new.template;
        },
      error: err => {
          this.error = err.error.error;
      },
      complete: () => {
      }
    })
  }

  loadFile(event : Event){
    let target = event.target as HTMLInputElement;
    if(target.files)
    this.image = target.files[0] ;
    
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
    let formData = new FormData();
    formData.append('title',this.title);
    formData.append('teaser',this.teaser);
    if(this.image)
    formData.append('image',this.image);
    formData.append('date',this.date);
    formData.append('template',this.template);
    if(this.editMode){
      this.editNews(formData);
    }else{
      this.addNews(formData);
    }
    
  }

  addNews(formData : FormData){
    this.newsService.addNews(formData).subscribe({
      next: (event: any) => {
          this.router.navigate(['/application/management/news']);
          
        },
      error: err => {
          this.error = err.error.error;
      },
      complete: () => {
      }
    })
  }

  editNews(formData : FormData){
    this.newsService.updateNews(this.newsEditId , formData).subscribe({
      next: (event: any) => {
          this.router.navigate(['/application/management/news']);
        },
      error: err => {
          this.error = err.error.error;
      },
      complete: () => {
      }
    })
  }

}
