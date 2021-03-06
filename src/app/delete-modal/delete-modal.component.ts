import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../services/user.service';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DeleteModalComponent {
  private $ : any;

  constructor(private userService: UserService) { }


  public deleteUserModal(event) {
    $('#delete-modal').modal({
      onDeny    : function() { return true;},
      onApprove : () => { this.deleteUser() }
    })
    .modal('show');

    event.stopPropagation();
  }


  public deleteUser(){
    this.userService.deleteUser().subscribe(data => {this.userService.logoutUser()}, err => {console.log("Somethin bad happened")})

    return true;
  }
}
