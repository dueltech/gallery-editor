# Duel gallery settings

## Content settings

**id:** Gallery id to fetch the assets from

* Type: **String**  →  ObjectId

*or*

**product:** Combination of the client’s short id and the product sku

* Type: **String**  →  `‘shortId/sku’`

**displayMin:** How many entries should the gallery at least have in order to be rendered?

* Type: **Number**

**sort:** How should the content be sorted by default?

* Type: **String**  →  `‘created’` | `‘created-desc’` | `‘rank’` | `‘random’`
* Default: `'rank’`

**sortDisplay:** Which sort controls should be displayed?

* Type: **String**  →  Values for `sort` separated by whitespace, e.g. `'created created-desc'`


## Color settings

**color:** Foreground/text color of the gallery

* Type: **String**  →  CSS Color
* Default: `‘hsl(0, 0%, 13%)’`  →  `#212121`

**bgColor:** Background color of the gallery

* Type: **String**  →  CSS Color
* Default: `‘hsl(0, 0%, 100%)’`  →  white

**thumbColor:** Foreground/text color of the thumbnail when hovering over

* Type: **String**  →  CSS Color
* Default: `‘hsl(0, 0%, 100%)’`  →  white

**thumbBgColor:** Background color of the thumbnail when hovering over

* Type: **String**  →  CSS Color
* Default: `auto`  →  Computed based on the colors of the image

## Layout Settings

**layoutStyle:** Changes the basic layout of the gallery to a grid, carousel or list. If supplied as an array, all styles get evaluated in order and the first one where all conditions are met (if there are any), wins.

* Type: __[LayoutStyleRule]__

  *or* **String**  →  `‘grid’` | `‘carousel’` | `‘list’`
* Default: `‘grid’`

**layoutRules:** Specify how many rows/columns the gallery should have based on CSS media queries. You can specify a set of rules for each gallery style individually.

* Type: **Object**  →  `{ [type]: [LayoutRule], ... }` where *type* is a layout style

  *or* __[LayoutRule]__  →  only makes sense if *layoutStyle* is static

> For more information on the format of layoutStyle and layoutRules, have a look at the [Typescript interfaces](#typescript-interfaces) at the end of the document.

**columns:** Changes how many columns the gallery has. Has no effect if *layoutStyle* is ‘list’.

* Type: **Number**
* Default: `auto`

**rows:** Changes how many rows the gallery has. Has no effect if *layoutStyle* is ‘carousel’.

* Type: **Number**
* Default: `auto`

## Display Settings

**hideAttributions:** Hide or show the display name (entry submitter’s name) when hovering over the asset and inside the modal

* Type: **Boolean**
* Default: `false`

**hideDates:** Hide or show the entry submission date when hovering over the asset and inside the modal

* Type: **Boolean**
* Default: `false`

**testimonialPreview:** Preview the testimonial when hovering over the asset

* Type: **Boolean**
* Default: `false`

**ratingPreview:** Preview the rating when hovering over the asset

* Type: **Boolean**
* Default: `false`

## Advanced Settings

**container:** Specify the container that the gallery should be appended to

* Type: **String**  →  CSS selector

  *or* **Node**  →  DOM Node
* Default: `‘#duelvision-component’`

## Typescript Interfaces

```typescript
enum LayoutStyle {
 Grid = 'grid',
 Carousel = 'carousel',
 List = 'list',
}

interface LayoutStyleRule {
 type: LayoutStyle;
 displayMin?: number;
 displayMax?: number;
 mediaQuery?: string;
}

interface LayoutRule {
 rows?: number;
 columns?: number;
 mediaQuery?: string;
}

interface LayoutRules {
 grid?: LayoutRule[];
 carousel?: LayoutRule[];
 list?: LayoutRule[];
}
```