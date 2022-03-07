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

<style>

    .node {
      stroke: #fff;
      stroke-width: 0.4px;
    }
    
    .link {
       stroke: rgb(0,0,0);
      stroke-width: 0.5px;
    }
    
    .multiselect {
  width: 200px;
}

.selectBox {
  position: relative;
}

.selectBox select {
  width: 100%;
  font-weight: bold;
}

.overSelect {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

#checkboxes {
  display: none;
  border: 1px #dadada solid;
}

#checkboxes label {
  display: block;
}

#checkboxes label:hover {
  background-color: #1e90ff;
}
    </style>

<!-- Load d3.js -->
<script src="https://d3js.org/d3.v4.js"></script>

<!-- Create a div where the graph will take place -->
<div id="my_dataviz"></div>
Minimum Posts per user
<input id="postCutoff" type="number" step="any" value="100">
<button id="updateButton">Update Graph</button>
<form>
  <div class="multiselect">
    <div class="selectBox" onclick="showCheckboxes()">
      <select>
        <option>Select Subreddits to Include</option>
      </select>
      <div class="overSelect"></div>
    </div>
    <div id="checkboxes">
    <label><input class="checkbox" type="checkbox" value="alltheleft" checked>alltheleft</label>
    <label><input class="checkbox" type="checkbox" value="AmericanPolitics" checked>AmericanPolitics</label>
    <label><input class="checkbox" type="checkbox" value="Anarchism" checked>Anarchism</label>
    <label><input class="checkbox" type="checkbox" value="Anarchist" checked>Anarchist</label>
    <label><input class="checkbox" type="checkbox" value="AnarchoPacifism" checked>AnarchoPacifism</label>
    <label><input class="checkbox" type="checkbox" value="blackflag" checked>blackflag</label>
    <label><input class="checkbox" type="checkbox" value="Capitalism" checked>Capitalism</label>
    <label><input class="checkbox" type="checkbox" value="Communist" checked>Communist</label>
    <label><input class="checkbox" type="checkbox" value="Conservative" checked>Conservative</label>
    <label><input class="checkbox" type="checkbox" value="conservatives" checked>conservatives</label>
    <label><input class="checkbox" type="checkbox" value="conspiracy" checked>conspiracy</label>
    <label><input class="checkbox" type="checkbox" value="democracy" checked>democracy</label>
    <label><input class="checkbox" type="checkbox" value="democrats" checked>democrats</label>
    <label><input class="checkbox" type="checkbox" value="GreenParty" checked>GreenParty</label>
    <label><input class="checkbox" type="checkbox" value="Liberal" checked>Liberal</label>
    <label><input class="checkbox" type="checkbox" value="Libertarian" checked>Libertarian</label>
    <label><input class="checkbox" type="checkbox" value="LibertarianSocialism" checked>LibertarianSocialism</label>
    <label><input class="checkbox" type="checkbox" value="Liberty" checked>Liberty</label>
    <label><input class="checkbox" type="checkbox" value="moderatepolitics" checked>moderatepolitics</label>
    <label><input class="checkbox" type="checkbox" value="neoprogs" checked>neoprogs</label>
    <label><input class="checkbox" type="checkbox" value="politics" checked>politics</label>
    <label><input class="checkbox" type="checkbox" value="progressive" checked>progressive</label>
    <label><input class="checkbox" type="checkbox" value="republicanism" checked>republicanism</label>
    <label><input class="checkbox" type="checkbox" value="Republican" checked>Republican</label>
    <label><input class="checkbox" type="checkbox" value="republicans" checked>republicans</label>
    <label><input class="checkbox" type="checkbox" value="SocialDemocracy" checked>SocialDemocracy</label>
    <label><input class="checkbox" type="checkbox" value="socialism" checked>socialism</label>
    <label><input class="checkbox" type="checkbox" value="uspolitics" checked>uspolitics</label>
    </div>
  </div>
</form>


<script src="d3_test.js"></script>

As we continue our investigation, we hope to more robustly identify misinformation by utilizing natural language processing techniques to analyze comments on posts and look for flags indicating that a post is misinformation. Additionally, we may choose to highlight specific users with a large number of posts in future graphs, as well as potentially making a graph of users based on how users comment on each other’s posts. 

Graphs of word frequency in comments relative to misinformation: (include additonal descriptions etc later)

[Comments Graph 1](comments_graph_1.html)

[Comments Graph 2](comments_graph_2.html)

### Results

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Sources

```markdown
1. Source
2. Source 2
3. etc
```

