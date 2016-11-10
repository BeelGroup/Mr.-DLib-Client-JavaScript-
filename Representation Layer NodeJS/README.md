NodeJS Web application for handling the display of the recommended articles from mr-dlib API to user interface.

the route consists of partner_name/article_id

such as:

https://gesis.herokuapp.com/gesis/csa-pais-2003-1207910

routes are defined in app.js

The application requests the recommendations from mr-dlib API. (in routes/gesis and routes/gesis2.js).

Two routes represent two partners.

the response of mr-dlib API is put in extracted in a list of recommended articles then rendered in views/gesis.ejs and views/gesis2.ejs

The styles are stylesheets in Public/stylesheets/style.css