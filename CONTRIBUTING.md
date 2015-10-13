# Contribution guidelines

- [Found a bug?](#issue)
- [Submission guidelines](#guidelines)
    - [Submitting an issue](#submit-issue)
    - [Submitting a pull request](#submit-pr)
        - [After your pull request is merged](#after-merge)
- [Coding rules](#rules)

Contributions to eclib are always welcome!

## <a name="issue"></a> Found a bug?

You can report bugs on our [issue tracker][issues], here on Github.
If you want to write a patch, just submit a [pull request][pr] to us.

## <a name="guidelines"></a> Submission guidelines

Before submitting a patch or an issue, there's a few guidelines we'd like you
to follow:
- **Title**: It should be meaningful, describing the issue/pr in a few words
- **Labels**: Labels are helping us helping you, use them!

### <a name="submit-issue"></a> Submitting an issue
Before submitting an issue, please check the archive, your question may already
be there. If your issue appears to be a bug, and hasn't been reported yet, open
a new issue. Help us maximize the effort we can spend fixing issues and adding
new features, by not reporting duplicate issues.

Providing a set of steps leading to the error, or your output log will be handy
most of the time.

### <a name="submit-lp"></a> Submitting a pull request
Before submitting a patch, please ensure that your commits are respecting a few
rules:
**Concise**: Your one-liner should be 52 characters long, or at least never go
beyond 72 chars.
**Meaningful**: Please specify your changes, what they are, where they are and
why they are needed. There's many examples in the repository.

Those rules are here to ensure that future contributors have an easier time
actually contributing.

#### <a name="after-merge"></a> After your pull request is merged

After your pull request is merged, you can safely delete your branch and
pull the changes from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or
  your local shell as follows:
```sh
git push origin --delete my-feature-branch
```

* Check out the master branch:
```sh
git checkout master -f
```

* Delete the local branch:
```sh
git branch -D my-feature-branch
```

* Update your master with the latest upstream version:
```sh
git pull --ff upstream master
```

## <a name="rules"></a> Coding rules

We do not have strict guidelines, but we do indent everything at 4 spaces.
Please try to follow the actual code style if you can.

[issues]: https://github.com/scality/eclib/issues
[pr]: https://github.com/scality/eclib/pulls
