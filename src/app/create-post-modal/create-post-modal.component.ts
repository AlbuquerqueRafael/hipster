import { Component, OnInit, Output, ViewEncapsulation, EventEmitter} from '@angular/core';
import { PublicationService } from '../services/publication.service';
import { ActivatedRoute } from '@angular/router';
import { FormValidationService } from "../services/form-validation.service";
import { HipsterTranslate } from "../services/hipster-translate.service";
import { UserService } from "../services/user.service";

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreatePostModalComponent implements OnInit {
  @Output() getAllPublications = new EventEmitter<string>();
  public publication;
  public colors: Object;
  public originalListGenres : Array<Object>;
  public listGenres : Array<Object>;
  public years : Array<number>;
  public selectedGenre: string;
  public ownerUsername: string;
  public errorInfo: Array<Object>;
  public requestErrors: Array<string>;

  constructor(private publicationService: PublicationService,
              private route: ActivatedRoute,
              private formValidation: FormValidationService,
              private hipsterTranslate: HipsterTranslate,
              private userService: UserService) {
    this.publication = {};
    this.colors = this.publicationService.getGenreColorObjects();
    this.listGenres = this.publicationService.getListGenres();
    this.originalListGenres =  this.listGenres.slice();
    this.selectedGenre = "genre";
    this.initSemanticValidationFormInfo()
    this.years = this.userService.getBirthdayYearsArray('1905');

  }

  ngOnInit() {
    $('#load_indication').hide();
    this.requestErrors = [];
    $('#genres_select').dropdown();
    $('#year_select').dropdown();
  }

  public createPostModal(event) {
    this.publication = {genres : [], ownerUsername: ''};
    this.ownerUsername = '';
    this.publication["ownerUsername"] = window.localStorage.username;
    this.requestErrors = [];
    this.listGenres =  this.originalListGenres.slice();

    $('#genres_select').dropdown('clear');
    $('#year_select').dropdown('clear');

    $('#create-post').modal({
      onDeny    : function() { return true;}
    })
    .modal('setting', 'closable', false)
    .modal('show');

    event.stopPropagation();
  }

  public createPost() {
    this.initSemanticValidationForm();

    let genres = $('#genres_select').dropdown('get value').split(",");

    this.publication["genres"] = genres;

    let year = $('#year_select').dropdown('get value');
    this.publication["year"] = +year;

    if (this.isFormValid()) {
      $('#load_indication').show();
      this.publicationService.savePublication(this.publication).subscribe(
        data => {
          $('#create-post').modal('hide')
          $('#load_indication').hide();
          this.getAllPublications.emit();
        }, err => {
          $('#load_indication').hide();
          let errors = err.error.split(';');
          errors.splice(errors.length - 1, 1);
          this.hipsterTranslate.translateErrorsPublication(errors);
          this.requestErrors = errors;
        }
      );
    }

    return false;
  }

  private getClass(genre) {
    return this.colors[genre.name];
  }

  private isFormValid() {
    return $('#post-form').form('is valid');
  }

  private initSemanticValidationFormInfo() {
    this.errorInfo = [{"input": "url", errors: ['empty'], prompt : ["ERRORS.PUBLICATION.URL"]}]

  }

  private initSemanticValidationForm() {
    let data = this.formValidation.getFormValidationVariables(this.errorInfo);
    $('#post-form').form(data);
  }

}
