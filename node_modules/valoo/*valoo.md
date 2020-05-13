<h1 align=center>🐻 valoo</h1>
<p align=center><em>just the bare necessities of state management.</em></p>
<p align=center><img src="https://i.imgur.com/Ke0BCSf.jpg" width="572"></p>

## Usage

Hotlink it from `https://unpkg.com/valoo`.

See [Interactive Codepen Demo](https://codepen.io/developit/pen/NzZoVp?editors=1010).

```js
import valoo from 'https://unpkg.com/valoo'

// create an observable value:
const num = valoo(42)

// subscribe to value changes:
const off = num.on( v => console.log(v) )

// unsubscribe that listener:
off()

// set the value, invoking any listeners:
num(43)

// get the current value:
num()  // 43
```

## Other Versions

- `valoo-lite.mjs`: lighter 120b version, but doesn't support unsubscribing.
- `valoo-original.mjs`: v1-compatible, with subscribe handled via overloading.

## Credit

The idea here was first implemented in [Mithril](https://mithril.js.org).
I believe the subscription mechanism is new though.

## License

Apache-2.0. Copyright 2018 Google LLC.
