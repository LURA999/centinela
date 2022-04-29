import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NuevaimagenComponent } from '../nuevaimagen/nuevaimagen.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  imageURL: string="";
  uploadForm: FormGroup;
  constructor(private dialog:NgDialogAnimationService,public fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: ['']
    })
  
   }

  ngOnInit(): void {
    
  }


  // Image Preview
  showPreview(event:any) {
    let file = (event.target as HTMLInputElement).files![0];

  this.uploadForm.patchValue({
      avatar: file
    });
    this.uploadForm.get('avatar')?.updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  // Submit Form
  submit() {
    console.log(this.uploadForm.value)
  }

}
  




