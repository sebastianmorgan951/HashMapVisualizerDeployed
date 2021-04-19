Check out the current version at https://sebastianmorgan951.github.io/HashMapVisualizerDeployed/

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How can you reproduce this code on your end to edit?

Here are the exact commands and steps I took to get everything working on my end!

`Install Node (version at least 8.10)`

`Install npm (version at least 5.6)`

From here, you just need to run some commands from the terminal of whatever system you use!

Enter these commands into your command-line:

`npx create-react-app your-project-name`

`cd your-project-name`

*To get an idea of what React looks like and to tinker with the basic app you're given at this point to learn
some HTML, run this:*

`npm start`

Otherwise, you can install the dependencies you'll need to clone this repository and make it work on your end!
Run these commands:

`npm install gh-pages --save-dev`

`npm install bootstrap@4.5.0 lodash@4.17.15 prop-types@15.7.2 classnames@2.2.6 node-sass@4.14.1`

This is enough to begin with! Now, you can move into your app directory and move the files from this repository there.
You will want to delete the default files put in when you made your app and replace them with the files from the repository.

Now, you can make changes to any files and see the effects by running:

`npm start`

##Comments on my code

- There is a *lot* of weird code in this. For example, when using `setState({})` within my .js and .jsx files,
I very quickly learned that the way these values were asynchronously updated made it difficult to be sure that
  my hashmap algorithm would work well when many changes were made before React decided to update my `setState({})` calls.
  Because of this and the fact that the project was small enough for me to understand the project, I felt more comfortable
  simply directly changing the fields of objects, which is not a great practice in general, but something I will continue to work on and learn.

- The interface is *ugly*. This is true, I had a lot more fun implementing the algorithm and making sure each element of
the page updated and re-rendered at the right time. I may come back and make things look better, but this isn't too much of
  a priority for me as of now.
