import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';


export class Friend {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public country: string,
    public phone: string,
  ) {
  }
}

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  friends!:Friend[] ;
  closeResult : string = "";
  editForm!: FormGroup;
  private deleteId!: number;


  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.getFriends();
    this.editForm = this.fb.group({
      id:[''],
      firstName:[''],
      lastName:[''],
      email:[''],
      phone:[''],
      country:['']
    });

  }

  getFriends(){
    this.http.get<any>('http://192.168.43.62:9090/agents').subscribe(
      response => {
        console.log(response);
        console.log("En cours...");
        this.friends = response;
      }
    );
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://192.168.43.62:9090/addAgent';
    this.http.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  openDetails(targetModal: any, friend: Friend) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
   });
    document.getElementById('fname')?.setAttribute('value', friend.firstName);
    document.getElementById('lname')?.setAttribute('value', friend.lastName);
    document.getElementById('lemail')?.setAttribute('value', friend.email);
    document.getElementById('lphone')?.setAttribute('value', friend.phone);
    document.getElementById('lcountry')?.setAttribute('value', friend.country);

 }

 openEdit(targetModal: any, friend: Friend) {
  this.modalService.open(targetModal, {
   centered: true,
   backdrop: 'static',
   size: 'lg'
 });
 this.editForm.patchValue({
   id : friend.id,
   firstName : friend.firstName,
   lastName : friend.lastName,
   email : friend.email,
   phone : friend.phone,
   country : friend.country
 });
}
onSave(){
  const editURL = 'http://192.168.43.62:9090/updateAgent/'+this.editForm.value.id;
  console.log(this.editForm.value);
  this.http.put(editURL, this.editForm.value)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    })
}
openDelete(targetModal: any, friend: Friend) {
  this.deleteId = friend.id;
  this.modalService.open(targetModal, {
    backdrop: 'static',
    size: 'lg'
  });
}
onDelete() {
  const deleteURL = 'http://192.168.43.62:9090/deleteAgent/'+this.deleteId;
  this.http.delete(deleteURL)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    });
}



}
