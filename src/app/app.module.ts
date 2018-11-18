import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { ErrorComponent } from './error.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { WordPressService } from './services/wordpress.service';

import { UserDataComponent } from './components/user-data/user-data.component';
import { HttpServiceHelper } from './components/common/HttpServiceHelper';


export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read', 'mail.send']],
  ['https://graph.microsoft.com/beta/me', ['user.read', 'mail.send']],
  [
    'https://graph.microsoft.com/beta/me/drive/root:/documents/children',
    ['files.read.all']
  ]
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    UserDataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MsalModule.forRoot({
      clientID: '[ApplicationID/ClientID]',
      authority:
        'https://login.microsoftonline.com/[YOUR ApplicationID / ClientID HERE]',
      redirectUri: 'http://localhost:4200/',
      validateAuthority: true,
      cacheLocation: 'localStorage',
      postLogoutRedirectUri: 'http://localhost:4200/',
      navigateToLoginRequestUrl: true,
      popUp: true,
      consentScopes: ['user.read', 'files.read.all'],
      unprotectedResources: ['https://angularjs.org/'],
      protectedResourceMap: protectedResourceMap,
      // logger : loggerCallback,
      correlationId: '1234',
      // level: LogLevel.Verbose,
      piiLoggingEnabled: true
    })
  ],
  providers: [
    WordPressService,
    HttpServiceHelper,
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
