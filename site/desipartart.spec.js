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

  it('Function exists', function () {
    const processCommits = AYESEEEM.desipartart.processCommits;
    expect(processCommits).toBeDefined();
  });
});

describe('Integration Tests', function () {
  const module = AYESEEEM.desipartart;

  it('Minimal integration test - 1 commit, 1 file', function () {

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
