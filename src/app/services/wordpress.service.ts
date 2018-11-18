import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
export type MessageCallback = (payload: any) => void;

@Injectable({
  providedIn: 'root'
})
export class WordPressService {


  constructor() {

  }

  
}
