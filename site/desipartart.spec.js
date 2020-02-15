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

describe('processGitLog', function () {
  const processGitLog = AYESEEEM.desipartart.processGitLog;

  it('Function exists', function () {
    expect(processGitLog).toBeDefined();
  });

  it('Minimal integration test - 1 commit, 1 file', function () {

    // EOLs are always \n - git log behaviour on Windows is \n
    const singleCommitLogOutput = '' +
      '--01dc01e--2020-02-14--ayeseeem\n' +
      '17	0	README.md\n';

    const arrayOfLogLines = [
      '--01dc01e--2020-02-14--ayeseeem',
      '17	0	README.md',
      ''
    ];

    const result = processGitLog(arrayOfLogLines);

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
