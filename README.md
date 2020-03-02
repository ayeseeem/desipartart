`desipartart` - Design Analysis by VCS
======================================

`desipartart`: Design Partition is Art

Concept:

> Can we investigate and assess the quality and features of the design of
> some software by looking at how files have changed over time?
> By looking at which files change together, based on change sets from the
> history from a version control system?

Look at [`index.html`](site/index.html) for more.

TODOs
-----

- [x] Treat files as unique entities based on full path
- [ ] Look at "packages" based on directories, but not nested
  (like Java packages)
- [ ] Look at nesting, based on directories - split paths
- [ ] Follow file renames (includes moving folder?)
- [ ] (Optionally) include/exclude self-links
- [ ] (Optionally) include/exclude unlinked files
- [ ] Exclude edges representing fewer than N changes
  - Combine with exclude "unlinked" files - unlinked if edge is excluded
- [ ] Combine trees based on paths - for example, treat these two files as
  being in the same package even though the paths differ:

  - `src/main/java/org/ayeseeem/example/Example.java`
  - `src/test/java/org/ayeseeem/example/ExampleTest.java`

  Could either merge `src/main/` and `src/test` (merge one into the other),
  or perhaps just strip `src/main/` and `src/test` - less meaningful, but
  maybe easier?

- [ ] Keep track of dates and warn if log is not in chronological order
  (implying `--reverse` was not used to create the log).
  - Or better yet, automatically detect/fix order
  - Does order matter if not using/following renames?


### Visualisation Details ###

- [x] Display shorter filenames? (what about duplicates?)
- [ ] Is there a "pending" animation we can add to graph?
- [ ] Highlight linked files when you select a Node. Or an Edge.


### Implementation Details ###

- [ ] Use an up-to-date version of [visjs](https://github.com/visjs) instead of
  [vis.js ](https://visjs.org/)?
  - Don't use the Cloudflare one, install locally
- [ ] Extract and encapsulate graph/network concept
- [ ] use [` vis.DataView`](https://visjs.github.io/vis-data/data/dataview.html)
  to filter displayed data without modifying source data
  <https://visjs.github.io/vis-network/examples/network/data/dynamicFiltering.html>
- Prefer `=>` (arrow function expression) for short functions where possible


### Worries ###

- [ ] How come `package-info.java` is linked to so many files? Because it was
  added with a lot of files? Do we want/need to distinguish between file add
  and file change?
- [ ] Why are there so few (no) leaf nodes?


Licence
-------

The licence for this code is TBD, but it will be a liberal licence like
Apache or MIT.

- [vis.js](https://github.com/visjs)
  [vis-network](https://github.com/visjs/vis-network) (used for network graph
  visualisation) is dual
  [`LICENSE-APACHE-2.0`](https://github.com/visjs/vis-network/blob/master/LICENSE-APACHE-2.0) and
  [`LICENSE-MIT`](https://github.com/visjs/vis-network/blob/master/LICENSE-MIT).
- [Plotly.js](https://plot.ly/javascript/) (used for various visualisations) is
  MIT License
  [`LICENSE`](https://github.com/plotly/plotly.js/blob/master/LICENSE).
- [Jasmine](https://jasmine.github.io/) (used for unit tests) is
  [`MIT.LICENSE`](site/test/lib/jasmine-3.5.0/MIT.LICENSE).
