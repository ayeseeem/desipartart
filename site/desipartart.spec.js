'use strict';

describe('desipartart - set-up integration test', function () {
  const a = true;

  it('should demo that Jasmine is installed/configured', function () {
    expect(a).toBe(true);
  });
});

describe('desipartart Module', function () {
  it('Top-level namespace exists', function () {
    expect(AYESEEEM).toBeDefined();
  });

  it('Module exists', function () {
    expect(AYESEEEM.desipartart).toBeDefined();
  });
});

AYESEEEM.desipartart.testFixtures = {};
AYESEEEM.desipartart.testFixtures.simpleLogAsArrayOfLines = [
  '--01dc01e--2020-02-14--ayeseeem',
  '17	13	README.md',
  ''
];

describe('processGitLog', function () {
  const processGitLog = AYESEEEM.desipartart.processGitLog;

  it('Function exists', function () {
    expect(processGitLog).toBeDefined();
  });

  it('Minimal example test - 1 commit, 1 file', function () {
    const arrayOfLogLines = AYESEEEM.desipartart.testFixtures.simpleLogAsArrayOfLines;
    const result = processGitLog(arrayOfLogLines);

    expect(result.length).toBe(1);

    const commit = result[0];
    expect(commit.sha).toBe('01dc01e');
    expect(commit.dateStr).toBe('2020-02-14');
    expect(commit.user).toBe('ayeseeem');
    expect(commit.diffs.length).toBe(1);
    expect(commit.diffs[0])
      .toEqual({ additions: 17, deletions: 13, file: 'README.md' });
  });

  it('Handles `--` in username', function () {
    const arrayOfLogLines = [
      '--1a1a1a1--2020-02-17--username--with--double--dash',
      '17	13	Some.file',
      ''
    ];

    const result = processGitLog(arrayOfLogLines);

    const commit = result[0];
    expect(commit.sha).toBe('1a1a1a1');
    expect(commit.dateStr).toBe('2020-02-17');
    expect(commit.user).toBe('username--with--double--dash');
  });

  it('Handles `tab` in filename - tested with tab chars', function () {
    const arrayOfLogLines = [
      '--1234abc--2020-02-18--some-username',
      '111	222	Some	file',
      ''
    ];

    const result = processGitLog(arrayOfLogLines);

    const commit = result[0];
    expect(commit.diffs[0])
      .toEqual({ additions: 111, deletions: 222, file: 'Some	file' });
  });

  it('Handles `tab` in filename - tested with \\t', function () {
    const arrayOfLogLines = [
      '--1234abc--2020-02-18--some-username',
      '111\t222\tSome\tfile',
      ''
    ];

    const result = processGitLog(arrayOfLogLines);

    const commit = result[0];
    expect(commit.diffs[0])
      .toEqual({ additions: 111, deletions: 222, file: 'Some\tfile' });
  });

  // @Characterization
  it('Handles a commit with no files, if such a concept exists', function () {
    const arrayOfLogLines = [
      '--01dc01e--2020-02-14--ayeseeem',
      ''
    ];
    const result = processGitLog(arrayOfLogLines);

    expect(result.length).toBe(1);

    const commit = result[0];
    expect(commit.sha).toBe('01dc01e');
    expect(commit.dateStr).toBe('2020-02-14');
    expect(commit.user).toBe('ayeseeem');
    expect(commit.diffs.length).toBe(0);
  });
});

describe('processCommits', function () {

  const processCommits = AYESEEEM.desipartart.processCommits;

  it('Function exists', function () {
    expect(processCommits).toBeDefined();
  });

  const commit_example = {
    sha: '1111aaa',
    dateStr: '2020-02-21',
    user: 'some-user',
    diffs: [{ additions: 123, deletions: 123, file: 'path/file.txt' }]
  };

  it('Sets name to full path/filename, not just filename', function () {
    const result = processCommits([ commit_example ]);
    expect(result.nodesByFile.get('path/file.txt').name).toBe('path/file.txt');
  });

  it('Uses full path/filename as key, not just filename', function () {
    const result = processCommits([ commit_example ]);
    expect(result.nodesByFile.get('path/file.txt')).toBeDefined();
    expect(result.nodesByFile.get('file.txt')).not.toBeDefined();
  });
});

describe('edgesGroupedByWeight', function () {

  const edgesGroupedByWeight = AYESEEEM.desipartart.edgesGroupedByWeight;

  // TODO: ICM 2020-04-05: Need to be able to create simple test graph better than this
  const nodesByFile = {};
  // exampleEdge = { from: fromNodeId, to: toNodeId, weight: 0 };

  // TODO: ICM 2020-04-05: Test with input deliberately not grouped by weights
  // Deliberately not sorted by weight (for testing of sortedness)
  const edges = [
    { from: 1, to: 2, weight: 4444 },
    { from: 1, to: 3, weight: 22 },
    { from: 1, to: 4, weight: 22 },
    { from: 1, to: 5, weight: 333 },
    { from: 1, to: 6, weight: 333 },
    { from: 1, to: 7, weight: 333 },
  ];
  const hackedGraph = { nodesByFile, edges };
  hackedGraph.getNonSelfEdges = function () {
    return this.edges;
  }

  it('Groups by weight', function () {
    const result = edgesGroupedByWeight(hackedGraph);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(3);

    const inAnyOrder = jasmine.arrayWithExactContents;
    expect([...result.keys()]).toEqual(inAnyOrder([22, 333, 4444]));

    expect(result.get(22)).toEqual(inAnyOrder([
      { from: 1, to: 3, weight: 22 },
      { from: 1, to: 4, weight: 22 },
    ]));

    expect(result.get(333)).toEqual(inAnyOrder([
      { from: 1, to: 5, weight: 333 },
      { from: 1, to: 6, weight: 333 },
      { from: 1, to: 7, weight: 333 },
    ]));

    expect(result.get(4444)).toEqual(inAnyOrder([
      { from: 1, to: 2, weight: 4444 },
    ]));
  });

  it('Sorts keys by weight - ascending', function () {
    const result = edgesGroupedByWeight(hackedGraph);

    expect([...result.keys()]).toEqual([22, 333, 4444]);
  });

  it('Sorts entries by weight (ascending), not insertion order', function () {
    const result = edgesGroupedByWeight(hackedGraph);

    const entries = [...result.entries()];
    expect(entries[0][0]).toEqual(22);
    expect(entries[1][0]).toEqual(333);
    expect(entries[2][0]).toEqual(4444);
  });
});

describe('Minimal integration test', function () {
  const module = AYESEEEM.desipartart;

  it('1 commit, 1 file', function () {

    // EOLs are always \n - git log behaviour on Windows is \n
    const singleCommitLogOutput = '' +
      '--01dc01e--2020-02-14--ayeseeem\n' +
      '17	13	README.md\n';

    const arrayOfLogLines = AYESEEEM.desipartart.testFixtures.simpleLogAsArrayOfLines;

    const commits = module.processGitLog(arrayOfLogLines);
    const result = module.processCommits(commits);

    expect(result.nodesByFile).toBeDefined();
    expect(result.nodesByFile.size).toBe(1);
    expect(result.nodesByFile.get('README.md'))
      .toEqual({ id: 1, name: 'README.md' });

    expect(result.edges).toBeDefined();
    expect(result.edges.length).toBe(1);
    expect(result.edges[0])
      .toEqual({ from: 1, to: 1, weight: 1});
  });
});

describe('file utils', function () {

  it('pathOf', function () {
    const pathOf = AYESEEEM.desipartart.pathOf;

    expect(pathOf('path/file.ext')).toBe('path');
    expect(pathOf('path/file_without_ext')).toBe('path');

    expect(pathOf('some/path/file.ext')).toBe('some/path');
    expect(pathOf('some/path/file_without_ext')).toBe('some/path');

    expect(pathOf('/some/path/file.ext')).toBe('/some/path');
    expect(pathOf('/some/path/file_without_ext')).toBe('/some/path');

    expect(pathOf('file.ext')).toBe('');
    expect(pathOf('file_without_ext')).toBe('');
  });

  it('filenameOf', function () {
    const filenameOf = AYESEEEM.desipartart.filenameOf;

    expect(filenameOf('path/file.ext')).toBe('file.ext');
    expect(filenameOf('path/file_without_ext')).toBe('file_without_ext');

    expect(filenameOf('some/path/file.ext')).toBe('file.ext');
    expect(filenameOf('some/path/file_without_ext')).toBe('file_without_ext');

    expect(filenameOf('/some/path/file.ext')).toBe('file.ext');
    expect(filenameOf('/some/path/file_without_ext')).toBe('file_without_ext');

    expect(filenameOf('file.ext')).toBe('file.ext');
    expect(filenameOf('file_without_ext')).toBe('file_without_ext');
  });

});

