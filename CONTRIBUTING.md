# How do I Contribute?

So, you want to help? Here's where to start!

- Take a look at the existing [Issues](https://github.com/sabinadams/aurora/issues) or [create a new issue](https://github.com/sabinadams/aurora/issues/new)!
- Fork the Repo. Then, create a branch for any issue that you are working on. Finally, commit your work.
- Create a **[Pull Request](https://github.com/sabinadams/aurora/compare)**, which will be reviewed and given suggestions for improvements (if needed).

# Prerequisites

Node.js version installed, [latest LTS is recommended](https://nodejs.org/en/about/releases/)

# Development Environment

Setup and install the needed dependencies by following these steps:

```sh
git clone https://github.com/sabinadams/aurora
cd aurora
npm i
npm run dev
```

You're workflow will be as the following:

1. Add/Remove/Update/Delete prisma schemas in the `prisma` directory when you're developing a new feature or fixing a bug.
2. Make code changes.
3. See the results of your changes in `generated.prisma` file.
