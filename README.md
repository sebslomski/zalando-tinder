# Zalando Tinder

I'm 1.96m tall and quite slim.


It's fucking impossible for me to get a pullover with long enough sleeves.

Zalando is the only company (that I'm aware of) who has sleeve lengths in their product detail pages.


But not filter for them...


So I made my own frontend for Zalando to extract all pullovers with sleeves longer than 73cm in size M which also are in stock (that frustration, boy...!).


# Instructions

`node scraper.js > items.json`

Wrap the `items.json` with `[` and `]`.


`npm run build`

`python -m SimpleHTTPServer 8000`

`open http://127.0.0.1:8000`


Use arrow keys to go trough all pullovers. Right -> like, left -> dislike
