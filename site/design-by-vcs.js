function processGitLog(arrayOfLogLines) {

  function isInfoLine(line) {
    return line.startsWith('--');
  }

  function makeDiff(diffLine) {
    const diffRegex = /(.*)\t(.*)\t(.*)/;
    const found = diffLine.match(diffRegex);
    // TODO: ICM 2020-01-29: Assert found.length === 4
    // TODO: ICM 2020-01-29: Convert adds/removes to numbers
    const additions = found[1];
    const subtractions = found[2];
    const file = found[3];
    return { additions, subtractions, file };
  }

  function makeCommit(lines) {
    const infoLine = lines[0];

    const infoRegex = /--(.*)--(.*)--(.*)/;
    const found = infoLine.match(infoRegex);

    console.log(found.length);
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
  arrayOfLogLines.forEach(function(line) {
    console.log('line: ' + line);
    console.log('state: ' + state);

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
}
