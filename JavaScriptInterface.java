package com.example.m6;

import android.app.Activity;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;
import android.util.Log;
import android.widget.Toast;

import java.util.List;


public class JavaScriptInterface extends Activity {

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



    android.content.Context kontekst;

    String id = "";
    String name = "";
    List<ContactList> mList;
    public JavaScriptInterface(android.content.Context kontekst, List<ContactList> list) {
        super();
        mList = list;
        this.kontekst = kontekst;
    }
    @android.webkit.JavascriptInterface   // ved target >= 17 må dette være med
    public String showToast(String idFromAjax) {

        for (ContactList element : mList ){
            if (element.id.equals(idFromAjax)){
                return element.name;
            }
        }

        return "Wrong username or password";
    }
}
