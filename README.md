Design Analysis by VCS
======================

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
