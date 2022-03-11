# Political Misinformation on Reddit

The problem of online misinformation is one that has not only majorly dictated the public sentiment of certain political figures and events, but has also sowed a general distrust of political authority in most of the American public, leading to changes in outcomes of major elections and more.

[Reddit](https://www.reddit.com/), which is one of the largest American social platforms, has had a number of known incidents regarding misinformation, including the banning of numerous controversial subreddits.

## Introduction

In this project, we investigate the dissemination and characterization of misinformation spread on the online discussion site Reddit, looking specifically at a large subset of randomly selected American political subreddits using the Reddit API.

By taking advantage of Reddit’s hierarchical structure of subreddits, moderators, users, posts, and comments, we hope to replicate the investigation on the spread of misinformation on Twitter (from Q1) with a similar investigation on the spread of political misinformation on Reddit in the years 2020 and 2021.

We address questions such as the following:

```markdown
- To what extent do (American) political boards/forums/subreddits on Reddit share misinformation?
- Is there any notable difference in the k-core decomposition of Reddit vs. Twitter?
- Is there any significant difference across subreddits in the type of political misinformation being spread?
- Are there individual users that commonly spread political misinformation across all subreddits?
```

## Data Collection

Through the use of the Reddit API, which is well-documented and commonly used in similar studies, we were able to collect a robust dataset with which to do our analyses. Our datasets were primarily gathered through repeated calls to the Pushshift API along with the python Reddit API wrapper (PRAW), which allowed us to store metadata on approximately 2,000,000 Reddit posts from our list of political subreddits. We curated this list of subreddits in hopes of creating a sample that accurately represents all the differing communities of political information shared on Reddit, and then extracted all posts containing URLs from 2020 to 2021 in JSONL format, separated by subreddit. These posts contain specific information on the post title, ID, upvote ratio, score, and more. In order to determine if a given Reddit post is an instance of misinformation, we created a database of 800+ unreliable domains sourced from Iffy.com [2] that are known to regularly publish false information, as verified by low MBFC (Media Bias/Fact Check) and FR (Factual Reporting) scores. We then use this list of highly non-credible sources to cross-check and determine the presence of a matching URL that commonly spreads misinformation in a given Reddit post, using this as our final metric of information categorization. 

After doing so, we use the gathered Reddit posts to extract all associated comments using the Python Reddit API wrapper, which produces a CommentForrest object allowing us to perform a breadth-first search to access all top-level comments and their corresponding replies. As we are only interested in the most popular top-level (can not be a reply) comments, we then use the JSONL post files to cross check the Reddit post link and download up to 1000 top-level comments in CSV format. We note that the comments are parsed as messy and unformatted strings, with several non-English and non-unicode characters that will require processing before use.

## Methods

Utilizing the list of non-credible domains, we cross reference every outgoing link in our dataset one subreddit at a time to gather data on the proportion of links likely containing misinformation to the total number of links in the subreddit. We count the total number of posts for each subreddit over the two year span that contains urls to an outgoing site, along with the number of those urls that match a domain on our list. These data points are compiled on a CSV file with each row containing the subreddit name, total posts, and total posts with misinformation.

### Network Graph

The graph below between users and subreddits visualizes how users posted across subreddits and the amount of misinformation spread. Users and subreddits are both represented by a node, with an edge from a user to a subreddit if the user has posted in that subreddit. The size of the nodes for users is proportional to their total number of posts, and the color of the user node is blue if they have not posted misinformation, and orange if they have. The edges are also colored according to misinformation, with blue edges indicating a user has not posted misinformation to that subreddit and orange edges indicating that they have. Red nodes represent subreddits, with a connection between a user and subreddit if the user has posted to that subreddit. 

The nodes on the graph can be dragged to closely investigate connections, and clicking on a node will reveal information on the name of the subreddit or user, the number of posts, percentage of misinformation, and for users the subreddits that they have posted to. The minimum posts per user can be changed using the input below the graph, and the subreddits displayed can be selected in the dropdown. Clicking Update Graph will update the graph to only include users who have posted at least the number of times specified, and only the subreddits selected in the dropdown.

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
        <option>Select Subreddits</option>
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

### Comment Exploration

To accompany the aforementioned multi-level network analysis, we perform additional analyses on the associated top-level comments in order to further investigate the spread of political misinformation by characterizing a difference in the textual metadata of posts that contain true information and posts that contain misinformation. As such, we construct two descriptive models that allow us to compare across two categories (true and false information) the polarity and subjectivity, identify any highly associated words or phrases, and ultimately describe any significant discrepancies in the comments not only between the two target categories, but also across all subreddits. Before proceeding with the analysis, we clean and process the textual comment data to allow for uniform and unbiased NLP-- specifically, we use the NLTK and regex tokenize and replace functions (respectively) to split each comment into clean, lower-case, punctuation-free, and tokenized sentences. We then create a custom list of stop words building off of the vocabulary suggestions provided in the paper ‘Raising the Flag: Monitoring User Perceived Disinformation on Reddit’ by Achimescu et al. [3], which allows us to filter out superfluous or unneeded words/phrases such as ‘is’, ‘he’s’, or ‘bot’. We then loop through each subreddit and merge the CSV comment data with the JSONL post data to keep only the posts with at least one top-level comment (keeping each subreddit separate), and apply the same aforementioned technique of identifying misinformation using a predetermined list of unreliable domains. Finally, given that the size of our data has more than quadrupled after storing all textual comment data, we convert the data into lazy out-of-core dataframes using Vaex, which allows us to perform very large computational and visualization tasks in an on-the-fly, memory efficient manner.

The link below leads to a visual comparing comment sentiment polarity and subjectivity instances of real vs. fake information. We use semantic labels beyond just unicode characters to accurately extract the polarity and subjectivity values of each comment, given that the comments data contains many non-lexical instances of tone indicators such as exclamation marks, emoticons, emojis, and more. Also, we use intensity as a potential indicator of subjectivity, noting that the presence of certain words or phrases (such as ‘very’), expletives, and strong punctuation may indicate highly subjective comments. Here, polarity is scored on a [-1, 1] scale (with -1 indicating a highly negative sentiment and 1 indicating a highly positive sentiment), and subjectivity on a [0,1] scale (with 0 indicating a highly objective/neutral sentiment and 1 indicating a highly subjective sentiment).

The visual is a scatterplot depicting the polarity and subjectivity values for each comment, categorized by type of information. We also append two histograms on either axis to more accurately describe the numerical distribution of both metrics across each information type. The visual also holds interactive components, allowing the user to toggle between the descriptive tooltips, which contains the polarity value, subjectivity value, source subreddit, and type of misinformation, on each point (comment). Here, given that we generally consider the comments of posts that instances of misinformation to be more volatile and negative than those that don’t, we expect to observe a right skew in polarity and a left skew in subjectivity. 

[Polarity-Subjectivity Scatter](comments_graph_1.html)

The second plot we generate, linked below, allows us to visually compare the corpora of comments from posts that contain misinformation and those that don’t using a scatter plot made up of textual words and phrases. We use the ScatterText package to create a visualization of highest-ranking words/phrases from each category, allowing us to display hundreds of category-representative points. The tool takes in as input the same merged post and comment dataset, and uses a PyTextRank algorithm to rank words by their score and plot according to the category they most align with. Here, the word score is made up of several measures, namely precision, recall, non-redundancy, and characteristicness. By implementing all of these metrics in the descriptive model, we ensure that the statistically most meaningful words and phrases are extracted for each category, and that discriminative power (regardless of frequency), word frequency, co-occurrence, and association (respectively) are used to determine category. The resulting visual then takes advantage of relative position, color, and interactive tooltips to display in full the most characteristic words present in comments associated with both true and false information. Also, we include a search bar that allows the user to type in any word or phrases and click to view not only which category it belongs to, but also how often it appears in either category, what subreddit it is sourced from, and the original comment itself. 

[Comment Word Usage Scatter (WARNING: Takes a long time to load)](comments_graph_2.html)

## Results

Our social network analysis of both user and subreddit interactions reveals to us that approximately 7% of all information posted is misinformation, while some subreddits (typically right-leaning) and users are more prone to containing misinformation than others. We also construct a graph of only user to user interactions to track the spread of misinformation among users, noting that users who post frequently in the same forums are more likely to interact with each other. After performing k-core decomposition on both graphs, we generate k values of 15 and 2,911, respectively. While these values are not directly comparable to those found in the k-core decomposition of Twitter tweets, we do see that our k values are considerably larger than those of Twitter, which is to be expected given the structure of Reddit. The k-value of 15 on the user subreddit interaction graph indicates that the network has a core of size 15 subreddits-- or that the most densely populated core of political misinformation being spread exists within a core of 15 subreddits. This is a much larger community than the ~7-core found in Twitter (given that each subreddit can have thousands of users), and is highly indicative of an echo chamber effect among users of those 15 subreddits. And when comparing the user-user Reddit interactions to the user-user Twitter interactions, we find that misinformation exists mainly within tightly knit communities of nearly 3,000 users in the gathered subreddits. By finding these cores, we’ve shown that the same users and subreddits appear to spread misinformation, and through textual analysis we report similar findings for the comment’ content.

To further explore the difference in comment data for posts that do and don’t contain misinformation, we gain a more thorough understanding of what may textually characterize a given post as misinformation. By creating a scatterplot of the relationship sentiment polarity and subjectivity among gathered comments, we see that those of posts with misinformation tend to be slightly more negative in sentiment and potentially more subjective in nature (indicating possible dissent)-- in other words, without yet analyzing individual features in the comments, we find that a given post is more likely to contain misinformation if the comments are low in polarity and high in subjectivity. Upon employing NLP textrank and f-score techniques to gain a better understanding of topics discussed, we create a scattertext plot to visualize the most highly associated words in both categories (misinformation and true information). Here, we find that while the content of comments of posts with true information is rather random, the content of posts with misinformation tends to focus on a subset of often divisive political topics, especially those pertaining to right-leaning communities. In conjunction with the network analysis, these findings confirm our belief that information shared in the cores of misinformed posts tend to follow an echo chamber effect, wherein a nearly homogenous set of users, subreddits, and topics are being discussed. 

In conclusion, we present an investigation into both the structure and content of misinformation being shared in political forums on the social media site Reddit in the years 2020 and 2021. By gathering a large sample of data from nearly 30 political subreddits, we utilize network graph and NLP analysis to not only track the spread of misinformation between and among subreddits and users, but also visually compare the sentiment and content of the comments in posts that contain misinformation and those that don’t. Our findings reveal potential indicators of misinformation through both user and comment statistics, and we hope to continue this analysis in the future by potentially altering the way we categorize misinformation, and expanding our search to other media and social media formats.


### Sources

```markdown
1. Shao C, Hui P-M, Wang L, Jiang X, Flammini A, Menczer F, et al. (2018) Anatomy of an online misinformation network. PLoS ONE 13(4): e0196087. https://doi.org/10.1371/journal.pone.0196087
2. https://iffy.news/iffy-plus/
3. Achimescu, V.; Chachev, P.D. Raising the Flag: Monitoring User Perceived Disinformation on Reddit. Information 2021, 12, 4. https://dx.doi.org/10.3390/info12010004
4. arXiv:1703.00565 [cs.CL]
```

#### Credits
Aditi Shrivastava: adshriva@ucsd.edu

Tyler Ready: tready@ucsd.edu


