package com.loginfirebase;

import android.app.Application;

import com.facebook.react.ReactApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;

import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {


  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNGoogleSigninPackage(),

            new RNFirebasePackage(),
              //**  ADD THE FOLLOWING LINE **//
              new FBSDKPackage(mCallbackManager),
              new RNFirebaseAuthPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // Initialize the SDK before executing any other operations,
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);

  }
}
