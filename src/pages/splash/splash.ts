import { AngularFirestore } from '@angular/fire/firestore';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { HelperProvider } from '../../providers/helper/helper';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import * as firebase from 'firebase'
import { Firebase } from '@ionic-native/firebase';
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})
export class SplashPage {

  constructor(public navCtrl: NavController,
    private auth:AuthProvider, private api:ApiProvider,private FireBase: Firebase) {
  }


  verificationId: any;
  code = '';
  showCodeInput = false;




  ionViewDidEnter(){
    // this.auth.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  user={
    email:'moeidsaleem@gmail.com',
    password:'moeid123',
    phone:'+92 3331950718'
  }

  tab(){
   this.navCtrl.setRoot(TabsPage);
  }

  PhoneLoginNative(phoneNumber) {
    console.log(phoneNumber);
    this.FireBase.verifyPhoneNumber(`+923331950718`, 60)
      .then((credential) => {
        console.log(credential);
        this.verificationId = credential.verificationId;
        this.showCodeInput = true;
      }).catch((error) => console.error(error));
  }


err;
  login(){
    if(this.user.email !=='' && this.user.password !==''){
       this.auth.login(this.user.email ,this.user.password).then(resp=>{
         console.log(this.user);
         //time to set uid
         localStorage.setItem('uid', resp.user.uid);
         this.navCtrl.setRoot(TabsPage);

       }, err=>{
         this.err = err;
         setTimeout(()=>{
           this.err=null;
         },6000)
       })
      // this.helper.presentToast(`Invalid Credentials.`)

    }
  }



  signup(){
    this.navCtrl.setRoot(SignupPage);
  }

  loginMobile(){
    if(this.user.phone !==''){
      this.auth.loginWithPhone(this.user.phone).then(resp=>{
        console.log(resp);
        resp.confirm(this.auth.recaptchaVerifier).then(r=> {
          r.user.uid;
          console.log(r.user.uid);
          this.api.createUser(r.user.uid, this.user).then(done=>{
            console.log(`user created `);

          },err=> console.log(err))
        },err=> console.log(err))
      },err=> console.log(err))
    }
  }

}
