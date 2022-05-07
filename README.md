![Aurora (1)](https://user-images.githubusercontent.com/18456526/147911028-46df0f91-5e8b-465d-90c2-c5efdbd281dd.png)

<div align="center">
  <a href="https://www.npmjs.com/package/prisma-aurora">
    <img src="https://img.shields.io/npm/dt/prisma-aurora.svg?style=flat" />
  </a>
  <span>&nbsp;&nbsp;</span>
  <a href="https://slack.prisma.io/">
    <img src="https://img.shields.io/npm/v/prisma-aurora.svg?style=flat" />
  </a>
  <span>&nbsp;&nbsp;</span>
  <a href="https://github.com/sabinadams/aurora/actions/workflows/node.js.yml">
    <img src="https://github.com/sabinadams/aurora/actions/workflows/node.js.yml/badge.svg" />
  </a>
  <span>&nbsp;&nbsp;</span>
  <a href="https://github.com/sabinadams/aurora/actions/workflows/codeql-analysis.yml">
    <img src="https://github.com/sabinadams/aurora/actions/workflows/codeql-analysis.yml/badge.svg" />
  </a>
</div>

## What is Aurora?

Aurora is a CLI tool that stitches together prisma files, which allows you to split up the prisma schema into smaller, easier-to-manage chunks.

## Installation

First, install the aurora package as a dev dependency.

```sh
npm i --save-dev prisma-aurora
```

Once installed, create a file named `aurora.config.json`. This is what Aurora uses to find out which files to put together and where to output the generated combined file.

```json
{
  "files": ["./Datasource.prisma", "./Generator.prisma", "./User.prisma", "./Profile.prisma"],
  "output": "./output/file/path/file.prisma"
}
```

| Key    | Type     | Description                                                                                        |
| ------ | -------- | -------------------------------------------------------------------------------------------------- |
| Files  | String[] | A list of paths to .prisma files you want included in the merge (relative to config file location) |
| Output | String   | The location (including filename) to generate the combined file into.                              |

<br>

#### Running Aurora

Inside your project, you can now run the following command from the directory where your config file lives:

```sh
aurora
```

This will take all of the `.prisma` files you included in your configuration, combine them, and output them into the specified output file.

## How Merging Works

If you have two models in separate files that each have the same name but have different fields, the resulting merged model will have both of the individual models' fields.

Consider, for example, a situation where you have a prisma file for indivdual services in your application. Both files might describe a user differently in the context of their own functionality, but the resulting prisma client will need both sets of definitions.

##### AuthService.prisma

```prisma
model User {
    id        Int @id @default(@autoincrement())
    password  String
    email     String
    lastLogin DateTime @map("last_login")
}
```

##### ProfileService.prisma

```prisma
model User {
    id       Int @id @default(@autoincrement())
    username String
    email    String
    age      Int

    @@index([id])
}
```

After running `aurora`, the generated schema will look like this:

```prisma
model User {
    id        Int @id @default(@autoincrement())
    username  String
    email     String
    age       Int
    password  String
    lastLogin DateTime @map("last_login")

    @@index([id])
}
```

## Handling Relations Across Files

One common scenario that arises when splitting the schema out into smaller chunks is having to set up a relation from a model in one file to a model in another file. Aurora will handle this as long as you create an alias to the target relation model in the file you are working in that contains the fields the relationship involves.

For example, consider the scenario where you have an `Author` model and a `Book` model, each defined in separate files. An `Author` may have many `Book`s. Here's how we could define that.

##### Author.prisma

```prisma
model Author {
    id        Int @id @default(autoincrement())
    firstName String
    lastName  String
    dob       DateTime
    age       Int
    books     Book[]
}
model Book {
    id Int @id
    authorId Int
    author Author @relation(fields: [authorId], references: [id])
}
```

> Notice in the `Book` alias here, I only have to define the fields required to make the relationship.

##### Book.prisma

```prisma
model Book {
    id          Int @id @default(autoincrement())
    authorId    Int
    author      Author @relation(fields: [authorId], references: [id])
    pages       Int
    releaseDate DateTime
    genre       String
}
model Author {
    id Int @id
    books Book[]
}
```

The generated schema file will look like this:

```prisma
model Author {
    id        Int    @id
    books     Book[] @relation(name: "AuthorToBook")
    firstName String
    lastName  String
    dob       DateTime
    age       Int
}
model Book {
    id          Int @id @default(autoincrement())
    authorId    Int
    author      Author? @relation(name: "AuthorToBook", fields: [authorId], references: [id])
    pages       Int
    releaseDate DateTime
    genre       String
}
```

Aurora merges the fields to create one model with all relations defined.

> Technically speaking, in this scenario the `Author.prisma` file does not need the `Book` alias or `books` field on the `Author` model as those will get merged in from the `Book.prisma` schema. But I left them in to make the model more explicit.

---

## Contributing

Contributions are very welcome!

Read the [Contributing guide](https://github.com/sabinadams/aurora/blob/master/CONTRIBUTING.md) to get started.

## Missing Something?

If you have any questions or notice anything missing from this project, please feel free to create an issue or reach out to me on [twitter](https://twitter.com/sabinthedev)
