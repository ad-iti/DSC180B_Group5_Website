## Political Misinformation on Reddit

The problem of online misinformation is one that has not only majorly dictated the public sentiment of certain political figures and events, but has also sowed a general distrust of political authority in most of the American public, leading to changes in outcomes of major elections and more.

[Reddit](https://www.reddit.com/), which is one of the largest American social platforms, has had a number of known incidents regarding misinformation, including the banning of numerous controversial subreddits.

### Introduction

In this project, we investigate the dissemination and characterization of misinformation spread on the online discussion site Reddit, looking specifically at a large subset of randomly selected American political subreddits using the Reddit API.

By taking advantage of Reddit’s hierarchical structure of subreddits, moderators, users, posts, and comments, we hope to replicate the investigation on the spread of misinformation on Twitter (from Q1) with a similar investigation on the spread of political misinformation on Reddit in the years 2020 and 2021.

We address questions such as the following:

```markdown
- To what extent do (American) political boards/forums/subreddits on Reddit share misinformation?
- Is there any notable difference in the k-core decomposition of Reddit vs. Twitter?
- Is there any significant difference across subreddits in the type of political misinformation being spread?
- Are there individual users that commonly spread political misinformation across all subreddits?
```

### Data Collection

Through the use of the Reddit API, which is well-documented and commonly used in similar studies, we were able to collect a robust dataset with which to do our analyses. Our datasets were primarily gathered through repeated calls to the Pushshift API along with the python Reddit API wrapper (PRAW), which allowed us to store metadata on approximately 2,000,000 Reddit posts from our list of political subreddits. We curated this list of subreddits in hopes of creating a sample that accurately represents all the differing communities of political information shared on Reddit, and then extracted all posts containing URLs from 2020 to 2021 in JSONL format, separated by subreddit. These posts contain specific information on the post title, ID, upvote ratio, score, and more. In order to determine if a post is an instance of misinformation, we created a database of unreliable domains to cross-check and determine the presence of a URL that commonly spreads misinformation.

### Methods

In order to characterize misinformation, we utilized the aforementioned list of unreliable domains to cross reference every post in the dataset, moving one subreddit at a time. We counted the total number of posts for each subreddit over the two year span that contained urls to an outgoing site, along with the number of those urls that matched a domain on our list. These data points were compiled on a csv file with each row containing the subreddit name, total posts, and total posts with misinformation.

![Misinfo](https://github.com/ad-iti/DSC180B_Group5_Website/blob/main/docs/assets/images/misinfo.png)

![Graph](https://github.com/ad-iti/DSC180B_Group5_Website/blob/main/docs/assets/images/graph.png)

### Results

### Sources
