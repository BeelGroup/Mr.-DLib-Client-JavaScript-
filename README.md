# Mr. DLib JavaScript Client

## Purpose

Mr. DLib provides recommendations via its API as XML data. The JavaScript client is effectively a widget inserted into a content partner's website that presents these recommendations to the user.

## Structure

The JavaScript client consists of:
1. HTML snippet
2. JavaScript code
3. PHP proxy

The HTML snippet is a minimal piece of code that is inserted into Mr. DLib's content partner's website.

The JavaScript code contains all logic necessary for querying Mr. DLib's API.

This querying is usually routed through a PHP proxy server. The aim of this proxy server is to capsule users of the content partner's website from Mr. DLib.

## Code

This repository holds two versions of the JavaScript client:
1. The JavaScript client for the content partner GESIS
2. The JavaScript client for the content partner mediaTUM

## Notes

- The Gesis page file contains a sample of the partner's page and how to integrate mr-dlib in it.
- The proxy is the responsible for calling mr-dlib API, getting the recommended article list in XML and render it in HTML page
- The stylesheet contains the css for the styling the recommeded list.
- The javascript contains the js for getting the article id in the partner's page then loading the recommended article list in the page.
- Demo: http://js-client.demo.mr-dlib.org/
- The JavaScript uses the bootstrapping libraries (bootstrap and jquery). These are open source libraries, they can either be hosted in the cloud which is called CDN or locally in the digital library server.
- At the proxy header there is a declaration of who can access this service: header('Access-Control-Allow-Origin: *');