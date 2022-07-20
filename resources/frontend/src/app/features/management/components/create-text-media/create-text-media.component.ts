import { Router, ActivatedRoute } from '@angular/router';
import { NewsService } from './../../../dashboard/services/news.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-text-media',
  templateUrl: './create-text-media.component.html',
  styleUrls: ['./create-text-media.component.scss']
})
export class CreateTextMediaComponent implements OnInit {

  title: string ="";
  subtitle: string = "";
  picture: string = "";
  description: string =  "";
  image : File | null = null;

  error : any = null ;

  news : string | null =  null;

  editMode = false ;
  textMediaToEditId :string | null =  null;

  constructor( private newsService : NewsService , private router : Router , private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.news = this.route.snapshot.paramMap.get('news');
    this.textMediaToEditId = this.route.snapshot.paramMap.get('id');
    if(this.textMediaToEditId) {
      this.editMode = true ;
      this.getTextMediaNewsToEdit(this.textMediaToEditId);
    }

  }

  getTextMediaNewsToEdit(textMediaToEditId : any){
    this.newsService.getTextMediaNewsById(textMediaToEditId).subscribe({
      next: (event: any) => {
          this.title = event.textMedia.title;
          this.subtitle  = event.textMedia.subtitle;
          this.description =  event.textMedia.description;
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
      subtitle : this.subtitle, 
      image : this.picture, 
      description : this.description ,
    };
    let formData = new FormData();
    formData.append('title',this.title);
    formData.append('subtitle',this.subtitle);
    if(this.image)
    formData.append('image',this.image);
    formData.append('description',this.description);
    if(this.news)
    formData.append('newsId',this.news);
    if(this.editMode){
      this.editTextMedia(formData);
    }else{
      this.addTextMedia(formData);
    }
    
  }

  addTextMedia(formData : FormData){
    this.newsService.addNewsTextMedia(formData).subscribe({
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

  editTextMedia(formData : FormData){
    this.newsService.updateNewsTextMedia(this.textMediaToEditId , formData).subscribe({
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
