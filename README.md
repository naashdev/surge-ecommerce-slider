# Infinity Row
A jQuery slider plugin for infinite length sliding rows. The plugin uses CSS flexbox to align items inside a row horizontally allowing the row to bleed off the screen.

Inspired by the featured sessions component on the [Google I/O 2015 website](https://events.google.com/io2015/).

## How to
####Simple setup
Just initialize the plugin on a parent row element, passing in the items & button selectors.
```js
$('#row > .infinity-row').infinityRow({
  items: '.item',
  row_forward: '#row > .forward',
  row_backward: '#row > .backward'
});
```

#### Flexbox CSS styles
This plugin relies on the correct CSS settings being applied on the row element and its items to work correctly. 

For better flexibility when inserting into your project these CSS styles aren't added via jQuery, you'll need to either copy these directly from the `dist/core.css` file or add them to your stylesheet.

## Config options
Option | Type | Default | Notes
-------|------|---------|------
items | `string` | `div` |The items inside your row you'd like to move.
row_backward | `string` | `null` | The element you want to apply the row backward action.
row_forward | `string` | `null` | The element you want to apply the row forward action.
resize | `boolean` | `true` | Set to true if you'd like to refresh the slider's layout on resize.
fallback | `boolean` | `false`  | Set to true if you'd like to support browsers without Flexbox support.

#### Flexbox fallback
If `fallback` is set to true, you must include either the `dist/js/lib/modernizr.custom.js` file or your own [Modernizr](https://modernizr.com/) build for Flexbox feature detection. 

This will detect whether Flexbox is supported or if the fallback absolute positioning needs to be applied.
