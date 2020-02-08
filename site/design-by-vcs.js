function processGitLog(arrayOfLogLines) {
  'use strict';

  function processCommits(commits) {
    const files = new Set();
    commits.forEach(c => {
      c.diffs.forEach(d => files.add(d.file));
    });

    console.log(files);

    const nodesByFile = new Map();
    let nodeId = 1;
    files.forEach(f => {
      // TODO: ICM 2020-02-06: Add shortName() as a func?
      const shortName = f.substring(f.lastIndexOf("/") + 1);
      nodesByFile.set(f, { id: nodeId, name: shortName });
      nodeId++;
    });
    console.log(nodesByFile);

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
      const filesInCommit = new Set();
      c.diffs.forEach(d => {
        filesInCommit.add(d.file);
      });
      c.diffs.forEach(d => {
        filesInCommit.forEach(f => {
          // update weight - just count number of times changed together
          const edge = edgeFor(d.file, f);
          edge.weight = edge.weight + 1;
        });
      });
    });

    console.log('----------------------------------------------------------');
    console.log(nodesByFile);
    console.log(edges);
    console.log('----------------------------------------------------------');

    return { nodesByFile, edges };
  }

  function isInfoLine(line) {
    return line.startsWith('--');
  }

  function makeDiff(diffLine) {
    const diffRegex = /(.*)\t(.*)\t(.*)/;
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

    const infoRegex = /--(.*)--(.*)--(.*)/;
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
    console.log('line: ' + line);
    console.log('state: ' + state);

  arrayOfLogLines.forEach(function (line) {
    if (isInfoLine(line)) {
      state = states.info;

      // finish any in-progress commit
      if (commitLines !== null) {
        rawCommits.push(commitLines);
      }

      // start a new commit
      commitLines = [ line ];
    } else if (line === '') {
      state = states.skipping;
    } else {
      state = states.diff;

      // add a diff
      commitLines.push(line);
    }
  });

  console.log(rawCommits);

  const commits = rawCommits.map(makeCommit);

  console.log(commits);

  const hackedGraph = processCommits(commits);
  return hackedGraph;
}
