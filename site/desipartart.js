var AYESEEEM = (function (module) {

  function pathOf(filepath) {
    return filepath.substring(0, filepath.lastIndexOf("/"));
  }

  function filenameOf(filepath) {
    return filepath.substring(filepath.lastIndexOf("/") + 1);
  }

  function processCommits(commits) {
    const files = new Set();
    commits.forEach(c => {
      c.diffs.forEach(d => files.add(d.file));
    });

    console.log('' + files.size + ' files:');
    console.log(files);

    const nodesByFile = new Map();
    let nodeId = 1;
    files.forEach(f => {
      const shortName = filenameOf(f);
      nodesByFile.set(f, { id: nodeId, name: shortName });
      nodeId++;
    });

    const edges = [];

    // TODO: ICM 2020-02-04: verify finds from/to or to/from
    function edgeFor(fromFile, toFile) {
      const fromNode = nodesByFile.get(fromFile);
      const toNode = nodesByFile.get(toFile);
//      const edge = edges.find(element => (element.from === fromNode.id) && (element.to === toNode.id));
      const edge = edges.find(function (element) {
        return ((element.from === fromNode.id) && (element.to === toNode.id)) || ((element.from === toNode.id) && (element.to === fromNode.id));
      });
      if (edge === undefined) {
        const newEdge = { from: fromNode.id, to: toNode.id, weight: 0 };
        edges.push(newEdge);
        return newEdge;
      } else {
        return edge;
      }
    }

    commits.forEach(c => {
      // TODO: ICM 2020-02-11: Why a set, we expect only one line per file. Makes it easier to delete later, though
      const filesInCommit = new Set();
      c.diffs.forEach(d => filesInCommit.add(d.file));

      // Get/create each possible edge, but no duplicates
      // Include self links. Maybe needed one day, e.g. to record how much changed?
      c.diffs.forEach(d => {
        filesInCommit.forEach(f => {
          // update weight - just count number of times changed together
          const edge = edgeFor(d.file, f);
          edge.weight = edge.weight + 1;
        });
        // Remove the processed file
        filesInCommit.delete(d.file);
      });
    });

    console.log('----------------------------------------------------------');
    console.log(nodesByFile);
    console.log(edges);
    console.log('----------------------------------------------------------');

    return { nodesByFile, edges };
  }

  function processGitLog(arrayOfLogLines) {

    function isInfoLine(line) {
      return line.startsWith('--');
    }

    function makeDiff(diffLine) {
      const diffRegex = /(.*?)\t(.*?)\t(.*)/;
      const found = diffLine.match(diffRegex);
      // TODO: ICM 2020-01-29: Assert found.length === 4
      // TODO: ICM 2020-01-30: Handle invalid args?
      const additions = parseInt(found[1], 10);
      const deletions = parseInt(found[2]);
      const file = found[3];
      return { additions, deletions, file };
    }

    function makeCommit(lines) {
      const infoLine = lines[0];

      const infoRegex = /--(.*?)--(.*?)--(.*)/;
      const found = infoLine.match(infoRegex);

      // TODO: ICM 2020-01-28: Assert found.length === 4
      const sha = found[1];
      const dateStr = found[2];
      const user = found[3];

      const diffLines = lines.slice(1);
      // TODO: ICM 2020-01-29: Assert diffLines.length >= 1
      const diffs = diffLines.map(makeDiff);

      return { sha, dateStr, user, diffs };
    }

    const states = { skipping: 'skipping', info: 'info', diff: 'diff' };
    var state = states.skipping;

    const rawCommits = [];
    var commitLines = null;
    arrayOfLogLines.forEach(function (line) {
      if (isInfoLine(line)) {
        state = states.info;

        // start a new commit
        commitLines = [ line ];
      } else if (line === '') {
        state = states.skipping;

        // finish any in-progress commit
        if (commitLines !== null) {
          rawCommits.push(commitLines);
        }
      } else {
        state = states.diff;

        // add a diff
        commitLines.push(line);
      }
    });

    console.log('' + rawCommits.length + ' commits:');
    console.log(rawCommits);

    const commits = rawCommits.map(makeCommit);

    console.log(commits);

    return commits;
  }

  function analyseCommits(commits) {
    const filesPerCommit = commits.map(c => c.diffs.length);

    // TODO: ICM 2020-02-22: Use a Map
    const histogram = filesPerCommit.reduce(function (acc, curr) {
      if (acc[curr] === undefined) {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }
    
      return acc;
    }, {});

    console.log('number of files changed per commit - histogram:');
    console.log(histogram);
  }

  function analyseGraph(hackedGraph) {

    const weights = hackedGraph.edges.map(e => e.weight);

    // TODO: ICM 2020-02-22: Use a Map
    const histogram = weights.reduce(function (acc, curr) {
      if (acc[curr] === undefined) {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }
    
      return acc;
    }, {});

    console.log('number of changes per edge - histogram:');
    console.log(histogram);

    // Group By weight, so we can find the most linked files
    const groupedByWeight = hackedGraph.edges.reduce(function (acc, curr) {
      const weight = curr.weight;
      if (acc.get(weight) === undefined) {
        acc.set(weight, [ curr ]);
      } else {
        acc.get(weight).push(curr);
      }
    
      return acc;
    }, new Map());

    console.log('edges grouped by weight:');
    console.log(groupedByWeight);
  }

  // Module 'desipartart'
  module.desipartart = {
    pathOf,
    filenameOf,
    processGitLog,
    analyseCommits,
    processCommits,
    analyseGraph
  };

  return module;
}(AYESEEEM || {}));
