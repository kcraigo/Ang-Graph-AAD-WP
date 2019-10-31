import { Component, OnInit, Input } from '@angular/core';
import { BroadcastService } from '@azure/msal-angular';
import { MsalService} from '@azure/msal-angular';
import { HttpClient} from '@angular/common/http';
import { HttpServiceHelper } from '../common/HttpServiceHelper';
import { Subscription } from 'rxjs/Subscription';

import { IDocument } from './document';
import { Observable } from 'rxjs';
import { error } from 'util';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {

  private subscription: Subscription;
  userData;
  headers;
  error;

  // @Input()
  docList = [];

  docs;


  v1_Url = 'https://graph.microsoft.com/v1.0/me';
  Beta_Url = 'https://graph.microsoft.com/beta/me';
  documentFolder = '/drive/root:/documents:/children';

  constructor(
    private authService: MsalService,
    private httpService: HttpServiceHelper,
    private broadcastService: BroadcastService) {
  }

  ngOnInit() {
     this.getUSerProfile();

    this.subscription = this.broadcastService.subscribe('msal:acquireTokenSuccess', (payload) => {
      console.log('acquire token success ' + JSON.stringify(payload));
    });

    // acquireTokenSilent and acquireTokenPopup
    this.subscription = this.broadcastService.subscribe('msal:acquireTokenFailure', (payload) => {
      console.log('acquire token failure ' + JSON.stringify(payload));
      if (payload.indexOf('consent_required') !== -1 || payload.indexOf('interaction_required') !== -1) {
        this.authService.acquireTokenPopup(['user.read', 'files.read.all']).then((token) => {
          this.getUSerProfile();
        }, (error) => {
        });
      }
    });
  }

// call HttpService to retrieve the current users profile from Azure Active Directory
  getUSerProfile() {
    this.httpService.httpGetRequest(this.v1_Url)
      .subscribe(data => {
       this.userData = data;
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.error(' Http get request to MS Graph failed' + JSON.stringify(error));
      },
      () => {
        this.listUsersOneDriveDocuments();
      });

  }

  // call HttpService to retrieve a list of the current users OneDrive Documents
  listUsersOneDriveDocuments() {
    this.httpService.httpGetOneDriveDocs(this.Beta_Url + this.documentFolder)
    .subscribe(resp => {

      const keys = resp.headers.keys();
      this.headers = keys.map(key =>
        `${key}: ${resp.headers.get(key)}`);

        // access the body directly
        this.docs = {...resp.body};
        console.log(this.docs['value']);

          this.docList.push(this.docs['value']);

      });
  }

// extremely important to unsubscribe
  OnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
