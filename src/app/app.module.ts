import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import { userReducer } from './home/store/reducers/user.reducer';
import { UserEffects } from './home/store/effects/user.effects';
import {HomeModule} from "./home/home.module";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HomeModule,
    StoreModule.forRoot({ user: userReducer }),
    EffectsModule.forRoot([UserEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
