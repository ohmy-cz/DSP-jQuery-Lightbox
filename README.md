jQuery Lightbox
===============

This is a lightweight jQuery lightbox with inline css (to keep the dependencies at minimum).

- Supports both DIV and Iframe contents
- The iframe content has an animation and the lightbox stretches as the content inside the iframe loads and changes. This is great if zou incorporate some ajax in the content iframe that changes the layout. This only works for pages on the same domain.
- Close button
- The dark area behind the lightbox closes the lightbox
- Customizable initial size
- Hooks to a "lightbox" link class, like <a href="http://www.google.com" class="lightbox">Open lightbox</a>.
- can be invoked with jQuery's defined function $.lightbox();
- onclose handler/callback support
- adds ?lightboxmode=1 to the iframe src in case you need it in your server handling; for example for stripping the header and footer from a page that can be accessed both through and outside the lightbox.
- aligns itself to the center of the screen on browser window resize.
- the title of the lightbox changes according to the <title> tag of the iframe's content page.
- the lightbox can be controlled from within the iframe page; for example like this: window.parent.DSPLb.close();
 
Requirements:
-------------
- jQuery; http://www.jquery.com

Installation:
-------------
- Load jQuery in your page;
- Load js/lightbox.js in your page.
- Add class="lightbox" to some link with a href leading to a same-domain page
- (optional) Change the image links for the close button and loading animation in lightbox.js
- Put the lightbox script and the updated HTML page online
- Open the page in your favorite browser and click the link :)

Todo:
-----
- Cleanup