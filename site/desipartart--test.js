'use strict';

QUnit.test('desipartart - set-up integration test', function (assert) {
  assert.ok(true, 'Should demo that QUnit is installed/configured');
});

QUnit.module('desipartart Module');

QUnit.test('Top-level namespace', function (assert) {
  assert.ok(AYESEEEM !== undefined);
});

QUnit.test('Module exists', function (assert) {
  assert.ok(AYESEEEM.desipartart !== undefined);
});

QUnit.module('processGitLog');

QUnit.test('Function exists', function (assert) {
  const processGitLog = AYESEEEM.desipartart.processGitLog;
  assert.ok(processGitLog !== undefined);
});

QUnit.test('Minimal integration test - 1 commit, 1 file', function (assert) {
  const processGitLog = AYESEEEM.desipartart.processGitLog;

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

  assert.ok(result.nodesByFile !== undefined);
  assert.equal(result.nodesByFile.size, 1);
  assert.deepEqual(result.nodesByFile.get('README.md'),
    { id: 1, name: 'README.md' });

  assert.ok(result.edges !== undefined);
  assert.equal(result.edges.length, 1);
  assert.deepEqual(result.edges[0], { from: 1, to: 1, weight: 1});
});
