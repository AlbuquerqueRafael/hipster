import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PublicationService } from '../services/publication.service';
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostCommentComponent implements OnInit {

  @Input() comment;
  @Input() post;
  private isMyProfile: boolean;
  private creationDate: string;

  constructor(private publicationService: PublicationService,
              private userService: UserService) {
  }

  ngOnInit() {
    let date = new Date(this.comment.creationDate);
    this.creationDate = date.toLocaleString();

    let username = window.localStorage.username

    this.isMyProfile = (username === this.comment.ownerUsername);
  }

  public removeComment() {
    var index = this.post.comments.indexOf(this.comment, 0);
    if (index > -1) {
       this.post.comments.splice(index, 1);
    }

    let updatedPost = {
      _id: this.post._id,
      comments: this.post.comments
    }

    this.publicationService.updatePublication(updatedPost).subscribe(
      data => {}, err => {}
    );
  }

  private seeProfile() {
    let username = window.localStorage.username
    window.location.href = '/user/' + username;
  }

  public likeComment() {
    let username = window.localStorage.username

    if (this.comment.likes.includes(username)) {
      var index = this.comment.likes.indexOf(username, 0);
      if (index > -1) {
         this.comment.likes.splice(index, 1);
      }
    } else {
      this.comment.likes.push(username);
    }

    var index = this.post.comments.indexOf(this.comment, 0);
    this.post.comments[index] = this.comment;

    let updatedPost = {
      _id: this.post._id,
      comments: this.post.comments
    }

    this.publicationService.updatePublication(updatedPost).subscribe(
      data => {}, err => {}
    );
  }

  public getLikeCommentClass() {
    let username = window.localStorage.username
    return this.publicationService.getLikeCommentClass(username, this.comment.likes);
  }

}
