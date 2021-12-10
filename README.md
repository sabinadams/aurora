![Aurora](refraction.png)

<div align="center">
  <h1>Aurora</h1>

  <a href="https://www.npmjs.com/package/prisma-aurora"><img src="https://img.shields.io/npm/dt/prisma-aurora.svg?style=flat" /></a>

  <a href="https://slack.prisma.io/"><img src="https://img.shields.io/npm/v/prisma-aurora.svg?style=flat" /></a>
  <br />
  <br />
  <hr />
</div>

## What is Aurora?

Aurora is a CLI tool that stitches together prisma files, which allows you to split up the prisma schema into smaller, easier-to-manage chunks.

<hr>

## Installation

<br>
First, install the aurora package

```
npm i --save prisma-aurora
```

Once installed, create a file named `aurora.config.json` in the root of your project. The contents should be as describe below:
```json
{
  "files": [ <array of paths to prisma files> ],
  "output": "output-file-path"
}
```

Inside your project, you can now run the command `aurora`, which will take all of the `.prisma` files you included, combine them, and output them into the specified output file.

<hr>