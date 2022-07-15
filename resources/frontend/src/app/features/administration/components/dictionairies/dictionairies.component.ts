import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { DictionariesService } from './../../services/dictionaries.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dictionairies',
  templateUrl: './dictionairies.component.html',
  styleUrls: ['./dictionairies.component.scss']
})
export class DictionairiesComponent implements OnInit {

  dictionaries : any = [];

  key : any = null;
  value : any = null;
  lang : any = null;

  error : any = null;

  dictionaryToUpdate : any = null;
  updateMode = false; 

  isVisible = false;
  isOkLoading = false;

  constructor( private router: Router ,  private dictionariesService : DictionariesService , private modal: NzModalService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.dictionariesService.getDictionariesList().subscribe({
      next: (event: any) => {
          console.log(event);
          this.dictionaries = event.dictionary;
        },
      error: err => {
        
      },
      complete: () => {
      }
    })
  }

  showModal(): void {
    this.isVisible = true;
  }

  showUpdateModal(data : any): void {
    this.updateMode = true; 
    this.dictionaryToUpdate = data ;

    this.key = data.key;
    this.value = data.value;
    this.lang = data.lang;

    this.showModal();
  }

  clearForm(){
    this.dictionaryToUpdate = null;
    this.updateMode = false;
    this.key = null;
    this.value = null;
    this.lang = null;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.clearForm();
  }

  onSave(){
    if(this.updateMode){
      this.updateDictionary();
    }else{
      this.createDictionary();
    }
  }

  createDictionary(){
    this.isOkLoading = true;

    this.error = null;

    const formData: FormData = new FormData();
    formData.append('key', this.key ? this.key : '');
    formData.append('value', this.value ? this.value : '');
    formData.append('lang', this.lang ? this.lang : '');

    this.dictionariesService.addDictionary(formData).subscribe({
      next: (event: any) => {
          this.handleCancel();
          this.getData();
        },
      error: err => {
        this.error = err.error.error;
        this.isOkLoading = false;
      },
      complete: () => {
        this.isOkLoading = false;
      }
    })
  }

  updateDictionary(){
    this.isOkLoading = true;

    this.error = null;

    const formData: FormData = new FormData();
    formData.append('key', this.key ? this.key : '');
    formData.append('value', this.value ? this.value : '');
    formData.append('lang', this.lang ? this.lang : '');
    formData.append('id', this.dictionaryToUpdate.id ? this.dictionaryToUpdate.id : '');
    formData.append('_method', 'PUT');

    this.dictionariesService.updateDictionary(formData).subscribe({
      next: (event: any) => {
          this.handleCancel();
          this.getData();
        },
      error: err => {
        this.error = err.error.error;
        this.isOkLoading = false;
      },
      complete: () => {
        this.isOkLoading = false;
      }
    })
  }

  removeFromDictionaries( data : any , e : Event ){
    e.preventDefault();
    console.log('closed');

    this.modal.confirm({
      nzTitle: '<i>Do you Want to remove this Key ?</i>',
      nzContent: '<b>remove Key '+ data.key + '</b>',
      nzOnOk: () => {
        this.dictionariesService.removeDictionary(data.id).subscribe({
          next: (event: any) => {
              this.getData();
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
