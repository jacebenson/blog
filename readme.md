# Eleventy Excellent.

Easy to use Eleventy starter, based on the workflow suggested by Andy Bell's [buildexcellentwebsit.es](https://buildexcellentwebsit.es/).

## Features

**This starter includes:**

- **Cube Boilerplate**: Created by Andy Bell, available under the MIT License. [View Repository](https://github.com/Set-Creative-Studio/cube-boilerplate)
- Accessible site navigation, editable in `src/_data/navigation.js`
- Image optimization with Eleventy-img _([see blog post](https://eleventy-excellent.netlify.app/blog/post-with-an-image/))_
- Youtube embed with lite-youtube _([see blog post](https://eleventy-excellent.netlify.app/blog/post-with-a-video/))_
- Easy resource fetching with eleventy-fetch _([see blog post](https://eleventy-excellent.netlify.app/blog/post-with-fetched-content/))_
- Syntax highlighting via eleventy-plugin-syntaxhighlight _([see blog post](https://eleventy-excellent.netlify.app/blog/post-with-some-code/))_
- Advanced markdown handling _([see blog post](https://eleventy-excellent.netlify.app/blog/post-with-all-the-markdown/))_
- 301 redirects for Netlify _([see blog post](https://eleventy-excellent.netlify.app/blog/post-with-301-redirects/))_
- Automatically generated Open Graph images for blog posts _([see blog post](https://eleventy-excellent.netlify.app/blog/open-graph-images/))_
- Tailwind CSS - but not how you might expect _([see blog post](https://eleventy-excellent.netlify.app/blog/what-is-tailwind-css-doing-here/))_
- XML-sitemap
- dayjs handling dates & times
- Bundling via esbuild
- RSS feed (now you can add more than one)
- Links to platforms and social media profiles
- Mastodon domain verification snippet
- carbon.txt - to show that their digital infrastructure runs on green electricity
- Accessible dark and light mode based on user preference and custom toggle
- Tags in blog posts
- Accessible blog pagination
- A styleguide™


## Development

### Install dependencies

```
npm install
```

### Working locally

Starts watch tasks to compile when changes detected

```
npm start
```

### Creating a production build

Minify JS, CSS and HTML.

```
npm run build
```

## Built with Eleventy Excellent

[Sites that are based on / built with Eleventy Excellent. ](https://eleventy-excellent.netlify.app/built-with/)
Add your site by submitting a pull request! :)

## Credits and Thank yous

**Andy Bell**

- https://buildexcellentwebsit.es/
- https://cube.fyi/
- https://learneleventyfromscratch.com/

**Heydon Pickering**

Heydon creates some invaluable resources.

- https://every-layout.dev/
- https://inclusive-components.design/

**Zach Leatherman**

Zach is developing Eleventy and is constantly making it even better!

- https://www.11ty.dev/
- https://www.zachleat.com/

**Stephanie Eckles**

Stephanie provides a lot of resources for Eleventy and modern CSS.

- https://smolcss.dev/
- https://moderncss.dev/

**Ryan Mulligan**

I'm using Ryan's example of a breakout wrapper on this site.

Also have a look at those codepens!

- https://ryanmulligan.dev/
- https://codepen.io/hexagoncircle/

**Sara Soueidan**

I took a close look at Sara's recommendations for accessible theme switch and pagination in the Practical Accessibility course

- https://practical-accessibility.today/
- https://www.sarasoueidan.com/

**Steven Woodson**

The style guide was inspired by a [great talk on the Eleventy Meetup](https://www.youtube.com/watch?v=3mhA2bH6q8s). Steven also wrote a [blog post](https://stevenwoodson.com/blog/eleventy-style-guide-generator-step-by-step-guide-adding-to-an-existing-site/) about that.

**Aleksandr Hovhannisyan**

Aleksandr seems to value a well-structured project just as much as I do. It was the repo from aleksandrhovhannisyan.com that inspired me to write the article [Organizing the Eleventy config file](https://www.lenesaile.com/en/blog/organizing-the-eleventy-config-file/). The 301 redirect solution I'm using is from Aleksandr's article.

- https://github.com/AleksandrHovhannisyan
- https://www.aleksandrhovhannisyan.com/blog/eleventy-netlify-redirects/

**Manuel Matuzović**

Manuel is an accessibility expert. The menu I was using as default up to v2, is very much inspired by an article Manuel wrote on web.dev.

- https://web.dev/website-navigation/
- https://www.matuzo.at/

**Bernard Nijenhuis**

Bernard wrote the article on which the Open Graph Images implementation is based.

- https://bnijenhuis.nl/notes/automatically-generate-open-graph-images-in-eleventy/
