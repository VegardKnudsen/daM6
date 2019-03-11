package com.example.m6;

import android.Manifest;
import android.annotation.SuppressLint;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AbsRuntimePermission {

    private static final Uri K_URI = ContactsContract.Contacts.CONTENT_URI;
    private static final String ID = ContactsContract.Contacts._ID;
    private static final String NAVN = ContactsContract.Contacts.DISPLAY_NAME;
    private static final String HPN = ContactsContract.Contacts.HAS_PHONE_NUMBER;

    private static final Uri TEL_URI = ContactsContract.CommonDataKinds.Phone.CONTENT_URI;
    private static final String TEL_ID = ContactsContract.CommonDataKinds.Phone.CONTACT_ID;
    private static final String TEL_NUM = ContactsContract.CommonDataKinds.Phone.NUMBER;
    private static final String TEL_TYP = ContactsContract.CommonDataKinds.Phone.TYPE;

    private static final Uri E_URI = ContactsContract.CommonDataKinds.Email.CONTENT_URI;
    private static final String E_ID = ContactsContract.CommonDataKinds.Email.CONTACT_ID;
    private static final String E_DAT = ContactsContract.CommonDataKinds.Email.DATA;
    private static final String E_TYP = ContactsContract.CommonDataKinds.Email.TYPE;

    List<ContactList> contactList = new ArrayList<>();
    private static final int REQUEST_PERMISSION = 10;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        String html = "";
        String name = "";
        //trengs denne? settes i setContentView
        android.webkit.WebView wv = new android.webkit.WebView(this);

        WebView webView = new WebView(this);
        WebViewClient webViewClient = new WebViewClient();
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webView.setWebViewClient(webViewClient);
        super.onCreate(savedInstanceState);
        setContentView(webView);
        webView.loadUrl("http://10.250.100.180:3000/index.html");
        requestAppPermissions(new String[]{
                        Manifest.permission.READ_CONTACTS,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE,
                        Manifest.permission.WRITE_CONTACTS},
                R.string.perm, REQUEST_PERMISSION);


        Cursor k = getContentResolver().query(E_URI, null, null, null, null);
        //k.moveToFirst();
        if (k.getCount() > 0) {
            while (k.moveToNext()) {
                String id = k.getString(k.getColumnIndex(E_ID ));
                String superId = k.getString(k.getColumnIndex(E_DAT));
                html += id + ": " + k.getString(k.getColumnIndex(E_DAT)) + "<br>";

                //Epost
                Cursor e = getContentResolver().query(K_URI, null, ID +" = " + id, null, null);
                while (e.moveToNext()){
                    html += e.getString(e.getColumnIndex(ID)) + ": " + e.getString(e.getColumnIndex(NAVN)) + "<br>";
                    contactList.add(new ContactList(k.getString(k.getColumnIndex(E_DAT)), e.getString(e.getColumnIndex(NAVN))));

                }
                e.close();
            }
        }
        k.close();

        webView.addJavascriptInterface(
                new JavaScriptInterface(this, contactList),
                "javaobject"
        );

        //wv.loadData(html, "text/html", "utf-8");

    }

    @Override
    public void onPermissionGranted(int requestCode) {

        Toast.makeText(getApplicationContext(), "permission granted", Toast.LENGTH_LONG).show();
    }

    @Override
    public void onPointerCaptureChanged(boolean hasCapture) {

    }

}
