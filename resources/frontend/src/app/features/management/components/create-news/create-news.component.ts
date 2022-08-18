import { Router, ActivatedRoute } from '@angular/router';
import { NewsService } from './../../../dashboard/services/news.service';
import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { trigger, transition, animate, style } from '@angular/animations'



@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']

})
export class CreateNewsComponent implements OnInit {

  title: string ="";
  teaser: string = "";
  text: string = "";
  picture: string = "";
  textPicture: string = "";
  date: string =  "2022-04-05 00:00:00";
  template: string = '';
  image : File | null = null;
  textImage : File | null = null;
  public show: boolean = false;
  error : any = null;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    sanitize: false,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    uploadUrl: 'v1/image',
  };

  editMode = false;
  newsEditId: string | null = null;

  constructor( private newsService: NewsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.newsEditId = this.route.snapshot.paramMap.get('id');
    if(this.newsEditId) {
      this.editMode = true;
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
          this.text = event.new.newsText? event.new.newsText: "";
        },
      error: err => {
          this.error = err.error.error;
      },
      complete: () => {
      }
    })
  }

  loadFile(event : any){
    let target = event.target as HTMLInputElement;
    if(target.files) this.image = target.files[0];
    let element = event.target.parentElement?.children[0]?.children[1] as HTMLElement;
    element.textContent = event.target.files[0].name;
  }

  loadFileTextPicture(event : any){
    let target = event.target as HTMLInputElement;
    if(target.files) this.textImage = target.files[0];
    let element = event.target.parentElement?.children[0]?.children[1] as HTMLElement;
    element.textContent = event.target.files[0].name;
  }

  saveProfile(){
    this.error = null ;
    let data = {
      title : this.title,
      teaser : this.teaser,
      image : this.picture,
      date : this.date,
      template : this.template,
      text: this.text,
      textPicture: this.textPicture
    };

    let formData = new FormData();
    formData.append('title',this.title);
    formData.append('teaser',this.teaser);
    if(this.image) formData.append('image',this.image);
    if(this.textImage) formData.append('textImage',this.textImage);
    formData.append('date',this.date);
    formData.append('template',this.template);
    if(this.text) formData.append('text',this.text);
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

  triggerClick(event: any) {
    let parent = event.target.parentElement;
    if(!parent.classList.contains('m-form-input')) parent = parent.parentElement;
    parent.children[1].click();
  }
}
