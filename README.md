`desipartart` - Design Analysis by VCS
======================================

`desipartart`: Design Partition is Art

Concept:

> Can we investigate and assess the quality and features of the design of
> some software by looking at how files have changed over time?
> By looking at which files change together, based on change sets from the
> history from a version control system?

Look at [`index.html`](site\index.html) for more.

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
- [ ] Clean up the vis.js graph, it's still based on the demo
- [ ] Clean up the JavaScript for the demo, particularly use of `var`
- [ ] Extract and encapsulate graph/network concept


Licence
-------

The licence for this code is TBD, but it will be a liberal licence like
Apache or MIT.

[Jasmine](https://jasmine.github.io/) (used for unit tests) is
[`MIT.LICENSE`](site/test/lib/jasmine-3.5.0/MIT.LICENSE).
