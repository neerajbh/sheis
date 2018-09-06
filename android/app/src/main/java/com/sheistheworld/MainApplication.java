package com.sheistheworld;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;
import com.facebook.FacebookSdk;
import com.airbnb.android.react.maps.MapsPackage;

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
        new SQLitePluginPackage(),
        new MainReactPackage(),
        new RNGoogleSigninPackage(),
        new FBSDKPackage(mCallbackManager),
        new RNSqlite2Package(),
        new ImagePickerPackage(),
		new MapsPackage()
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
	FacebookSdk.setApplicationId("246550556001683");
        //initialize Facebook SDK
        FacebookSdk.sdkInitialize(getApplicationContext());
  }
}
