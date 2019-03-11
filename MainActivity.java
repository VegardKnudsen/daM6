package com.example.m6;

import android.Manifest;
import android.annotation.SuppressLint;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends AbsRuntimePermission {

    private static final int REQUEST_PERMISSION = 10;
    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        WebView webView = new WebView(this);
        WebViewClient webViewClient = new WebViewClient();
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webView.setWebViewClient(webViewClient);
        super.onCreate(savedInstanceState);
        setContentView(webView);
        webView.loadUrl("https://vg.no");
//https://www.dictionary.com/e/wp-content/uploads/2018/03/thisisfine-1-300x300.jpg
        requestAppPermissions(new String[]{
                Manifest.permission.READ_CONTACTS,
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_CONTACTS},
                R.string.perm, REQUEST_PERMISSION);
    }

    @Override
    public void onPermissionGranted(int requestCode) {

        Toast.makeText(getApplicationContext(), "permission granted", Toast.LENGTH_LONG).show();
    }

    @Override
    public void onPointerCaptureChanged(boolean hasCapture) {

    }
}
