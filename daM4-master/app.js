const port = 3000;

const express = require('express');
const sqlite3 = require('sqlite3');
const js2xmlparser = require('js2xmlparser');
const db = new sqlite3.Database('books.db');
const cookieParser = require('cookie-parser');
const xmlparser = require('express-xml-bodyparser');
const uuidv4 = require('uuid/v4');
const md5 = require('md5');
const app = express();

app.use(xmlparser());
app.use(cookieParser());
/*
*
*LOGIN
*
*/
app.post('/login', (req, res) => {   
    var data = {
        userID: req.body.logininfo.userid[0],
 		passwordhash: req.body.logininfo.passwordhash[0]
    }

    console.log(data.userID);
    console.log(data.passwordhash);

    var params = [data.userID];

    console.log("UserID: " + data.userID + " Password: " + data.passwordhash);
    console.log("Cookie: " + req.body.cookies);

    var SQL = `SELECT passwordhash, userID FROM user WHERE userID = ?`;
    db.get(SQL, params, (err, row) => {
        if(row != null) {
        	let username = row.userID;
        	let password = row.passwordhash;
        	let hashpassword = md5(data.passwordhash);

        	if (data.userID == username){
        		console.log("Username valid");
        		if (password == hashpassword){
        			console.log("Password valid");
                    var SQL = `INSERT INTO sessioninfo(sessionID, userID) VALUES(?,?);`;
                    var random = uuidv4();

                    var params = [random, data.userID];
                    console.log("Randomnumber: " + random);
                    db.run(SQL, params, (err) => {
                        if(err){
                            console.log("Something went wrong!");
                        }
                         else{
                            console.log("SessionID: " + random);
                        }
                    });
        			res.cookie("SessionID", random).send("Logged in");
        		} else {
        			console.log("Wrong username or password");
        			res.send("Wrong username or password");
        		}
        	} else {
        		console.log("Wrong username or password");
        		res.send("Wrong username or password");
        	}
        } else if(err){
            console.log("Something went wrong!");
        } else {
        	console.log("Noob!");
        	res.send("Contact admin!");
        }
    });
});

/*
*
*LOGOUT
*
*/
app.delete('/logout', (req, res) => {   

    var data = {
        sessionID: req.cookies['SessionID']
    }

    console.log("Cookie is : " + data.sessionID);

    var params = [data.sessionID];

    //DELETE FROM book WHERE bookID = ?

    var SQL = `DELETE FROM sessioninfo WHERE sessionID = ?`;

    db.run(SQL, params, (err, row) => {
        if(err){
            console.log("Something went wrong!");
        } else{
            res.clearCookie('SessionID', { path: '/cgi-bin/' }).send();
            console.log(data.sessionID + " session deleted!");
        }
    });
});

/*
*
* AUTHORS
*
*/

/*
* GET
*/
app.get('/authors/:authorid', (req, res) => {
    const authorLookup = req.params.authorid;

    db.all(
        'SELECT * FROM author WHERE authorID=$authorID',
        {
            $authorID: authorLookup
        },
        (err, rows) => {
            //console.log(rows);
            if(rows.length > 0){
                res.send(js2xmlparser.parse("author", rows));
            } 
            else {
                res.send("Couldn't find anything...")
            }
        }
    );
});

/*
* GET
*/
app.get('/authors', (req, res) => {
    //const authorsLookup = req.params.authors;

    db.all(
        'SELECT * FROM author',
        (err, rows) => {
            console.log(rows);
            if(rows.length > 0){
                //res.send(rows);
                res.send(js2xmlparser.parse("authors", rows));
            } 
            else {
                res.send("Couldn't find anything...")
            }
        }
    );
});

/*
* POST
*/
app.post('/authors', (req, res) => {
    var data = {
        authorID: req.body.useri.authorid[0],
        firstname: req.body.useri.firstname[0],
        lastname: req.body.useri.lastname[0],
        nationality: req.body.useri.nationality[0] 
    }
    console.log("Req cookie: " + req.cookies['SessionID']);
    sessionID = req.cookies['SessionID'];
    var SQL = `SELECT sessionID FROM sessioninfo WHERE sessionID = ?`;
    db.get(SQL, sessionID, (err, row) => {
        if(row != null) {
            if (row.sessionID == sessionID){
                var params = [data.authorID, data.firstname, data.lastname, data.nationality];
                console.log(data);
                var SQL = `INSERT INTO author(authorID, firstname, lastname, nationality) VALUES(?,?,?,?);`;
                
                db.run(SQL, params, (err) => {
                    if(err){
                        console.log("Something went wrong!");
                    } else {
                        console.log("Author has been added!");
                        res.send("Author has been added!");
                    }
                });
            } else {
                console.log("SessionID is not equal!");
                res.send("Your sessionID has expired! Please Login again, or contact admin.");
            }
        } else {
            console.log("Something went wrong!");
            res.send("You don't have authorization!");
        }
    });
});

/*
* PUT
*/
app.put('/authors', (req, res) => {
    var data = {
        authorID: req.body.useri.authorid[0],
        firstname: req.body.useri.firstname[0],
        lastname: req.body.useri.lastname[0],
        nationality: req.body.useri.nationality[0] 
    }

    sessionID = req.cookies['SessionID'];
    var SQL = `SELECT sessionID FROM sessioninfo WHERE sessionID = ?`;
    db.get(SQL, sessionID, (err, row) => {
        if(row != null) {
            if (row.sessionID == sessionID) {
                if (req.body.useri.firstname[0]) {
                    var SQL = `UPDATE author SET firstname = ? WHERE authorID = ?`;
                    var params = [data.firstname, data.authorID];

                    db.run(SQL, params, (err) => {
                        if(err) {
                            console.log("Something went wrong!");
                        } else {
                            console.log("Firstname changed!");
                        }
                    });
                } else if (req.body.useri.lastname[0]){
                    var SQL = `UPDATE author SET lastname = ? WHERE authorID = ?`;
                    var params = [data.lastname, data.authorID];

                    db.run(SQL, params, (err) => {
                        if(err) {
                            console.log("Something went wrong!");
                        } else {
                            console.log("Lastename changed!");
                        }
                    });
                } else if (req.body.useri.nationality[0]){
                    var SQL = `UPDATE author SET nationality = ? WHERE authorID = ?`;
                    var params = [data.nationality, data.authorID];

                    db.run(SQL, params, (err) => {
                        if(err) {
                            console.log("Something went wrong!");
                        } else {
                            console.log("Nationality changed!");
                        }
                    });
                }
                res.send("Changes have been made...");
            } else {
                console.log("SessionID is not equal!");
                res.send("Your sessionID has expired! Please Login again, or contact admin.");
            }
        } else {
            console.log("User not logged in!");
            res.send("You don't have authorization, please login!");
        }
    });
});

/*
* DELETE
*/
app.delete('/authors', (req, res) => {
    var data = {
        authorID: req.body.useri.authorid[0]
    }
    console.log(data);

    sessionID = req.cookies['SessionID'];
    var SQL = `SELECT sessionID FROM sessioninfo WHERE sessionID = ?`;
    db.get(SQL, sessionID, (err, row) => {
        if(row != null) {
            if (row.sessionID == sessionID) {
                if (req.body.useri.authorid[0]) {
    	           var SQL = `DELETE FROM author WHERE authorID = ?`;
    	           var params = [data.authorID];

    	           db.run(SQL, params, (err) => {
        	           if(err) {
            	           console.log("Something went wrong!");
            	           res.send("Something went wrong!");
        	           } else {
            	           console.log("Author " + data.authorID + " is deleted!");
            	           res.send("Author " + data.authorID + " is deleted");
        	           }
    	           });
                } else {
    	           var SQL = `DELETE FROM author`;

    	           db.run(SQL, (err) => {
        	           if(err) {
            	           console.log("Something went wrong!");
        	           } else {
            	           console.log("Tabel author has been deleted!");
            	           res.send("Tabel author has been deleted!");
        	           }
    	           });
                }
            } else {
                console.log("SessionID is not equal!");
                res.send("Your sessionID has expired! Please Login again, or contact admin.");
            }
        } else {
            console.log("User not logged in!");
            res.send("You don't have authorization, please login!");
        }
    }); 
});


/*
*
* BOOKS
*
*/

/*
* GET
*/
app.get('/books/:bookid', (req, res) => {
    const bookLookup = req.params.bookid;

    db.all(
        'SELECT * FROM book WHERE bookID=$bookID',
        {
            $bookID: bookLookup
        },
        (err, rows) => {
            if(rows.length > 0) {
                var xmlResponse = js2xmlparser.parse("book", rows);
                res.send(xmlResponse);
            } else {
                res.send("Couldn't find anything...")
            }
        }
    );
});

/*
* GET
*/
app.get('/books', (req, res) => {
    db.all('SELECT * FROM book', (err, rows) => {
        console.log(rows);
        if(rows.length > 0) {
            res.send(js2xmlparser.parse("books", rows));
        } else {
                res.send("Couldn't find anything...");
        }
        
    });
});


/*
* POST
*/
app.post('/books', (req, res) => {
    var data = {
        bookID: req.body.useri.bookid[0],
        booktitle: req.body.useri.booktitle[0],
        authorID: req.body.useri.authorid[0]
    }
    var params = [data.bookID, data.booktitle, data.authorID];
    
    sessionID = req.cookies['SessionID'];
    var SQL = `SELECT sessionID FROM sessioninfo WHERE sessionID = ?`;
    db.get(SQL, sessionID, (err, row) => {
        if(row != null) {
            if (row.sessionID == sessionID) {
                var SQL = `INSERT INTO book(bookID, booktitle, authorID) VALUES(?,?,?);`;
                console.log(data);

                db.run(SQL, params, (err) => {
                    if(err) {
                        console.log("Something went wrong!");
                        res.send("Something went wrong!");
                    } else {
                        console.log("Data added!");
                        res.send("Book " + data.bookID + " is added");
                    }
                });
            } else {
                console.log("SessionID is not equal!");
                res.send("Your sessionID has expired! Please Login again, or contact admin.");
            }
        } else {
            console.log("User not logged in!");
            res.send("You don't have authorization, please login!");
        }
    }); 

});

/*
* PUT
*/
app.put('/books', (req, res) => {
    var data = {
        booktitle: req.body.useri.booktitle[0], 
        authorID: req.body.useri.authorid[0],
        bookID: req.body.useri.bookid[0]
    }

    sessionID = req.cookies['SessionID'];
    var SQL = `SELECT sessionID FROM sessioninfo WHERE sessionID = ?`;
    db.get(SQL, sessionID, (err, row) => {
        if(row != null) {
            if (row.sessionID == sessionID) {
                if (req.body.useri.booktitle[0]) {
                    var SQL = `UPDATE book SET booktitle = ? WHERE bookID = ?`;
                    var params = [data.booktitle, data.bookID];
                    console.log(data);

                    db.run(SQL, params, (err) => {
                        if(err) {
                            console.log("Something went wrong!");
                        } else {
                            console.log("Data added!");
                        }
                    });

                } else if (req.body.useri.authorid[0]) {
                    var SQL = `UPDATE book SET authorID = ? WHERE bookID = ?`;
                    var params = [data.authorID, data.bookID];
                    console.log(data);

                    db.run(SQL, params, (err) => {
                        if(err) {
                            console.log("Something went wrong!");
                        } else {
                            console.log("Data added!");
                        }
                    });
                }
                res.send("Changes has been made");
            } else {
                console.log("SessionID is not equal!");
                res.send("Your sessionID has expired! Please Login again, or contact admin.");
            }
        } else {
            console.log("User not logged in!");
            res.send("You don't have authorization, please login!");
        }
    }); 

});

/*
* DELETE
*/
app.delete('/books', (req, res) => {
    var data = {
        bookID: req.body.useri.bookid[0]
    }
    sessionID = req.cookies['SessionID'];
    var SQL = `SELECT sessionID FROM sessioninfo WHERE sessionID = ?`;
    db.get(SQL, sessionID, (err, row) => {
        if(row != null) {
            if (row.sessionID == sessionID) {
                if (req.body.useri.bookid[0]) {
    	           var SQL = `DELETE FROM book WHERE bookID = ?`;
    	           var params = [data.bookID];

    	           db.run(SQL, params, (err) => {
        	           if(err) {
            	           console.log("Something went wrong!");
            	           res.send("Something went wrong!")
        	           } else {
            	           console.log("Book " + data.bookID + " has been deleted!");
            	           res.send("Book " + data.bookID + " has been deleted!");
        	           }
    	           });
                } else {
    	           var SQL = `DELETE FROM book`;

    	           db.run(SQL, (err) => {
        	           if(err) {
            	           console.log("Something went wrong!");
            	           res.send("Something went wrong!");
        	           } else {
            	           console.log("Tabel books has been deleted!");
            	           res.send("Tabel books has been deleted!");
        	           }
    	           });
                }
            } else {
                console.log("SessionID is not equal!");
                res.send("Your sessionID has expired! Please Login again, or contact admin.");
            }
        } else {
            console.log("User not logged in!");
            res.send("You don't have authorization, please login!");
        }
    }); 
});


app.listen(port, () => console.log('Listening on port ' + port));