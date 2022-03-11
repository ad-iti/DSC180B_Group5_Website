import os
import sys
import math
import networkx as nx
import json
from matplotlib import pyplot as plt

sublist = ['alltheleft', 'AmericanPolitics', 'Anarchism', 'Anarchist', 'AnarchoPacifism', 
            'blackflag',  'Capitalism', 'Communist', 'Conservative', 'conservatives', 
            'conspiracy', 'democracy','democrats', 'GreenParty', 'Liberal', 'Libertarian',
            'LibertarianSocialism', 'Liberty', 'moderatepolitics', 'neoprogs', 'politics', 
            'progressive','republicanism', 'Republican', 'republicans', 'SocialDemocracy',
            'socialism', 'uspolitics']

size_range = [25/4,250/4]
sub_size = 60/4
cutoff = 10

def main(targets):
    filename = 'misinformation_graph.edgelist'
    G = nx.read_edgelist(filename, create_using = nx.MultiDiGraph)
    post_count = {}
    mis_posts = {}
    user_colors = {}
    for e in G.edges(data='weight', keys=True):
        post_count[e[0]] = post_count.get(e[0], 0) + e[3]
        post_count[e[1]] = post_count.get(e[1], 0) + e[3]
        mis_posts[e[0]] = mis_posts.get(e[0], 0)
        mis_posts[e[1]] = mis_posts.get(e[1], 0)
        user_colors[e[0]] = max([user_colors.get(e[0], e[2]), e[2]])
        user_colors[e[1]] = 2
        if e[2] == 1:
            mis_posts[e[0]] = mis_posts.get(e[0], 0) + e[3]
            mis_posts[e[1]] = mis_posts.get(e[1], 0) + e[3]
    max_posts = 0
    for n in G.nodes:
        if post_count[n] > max_posts and n not in sublist:
            max_posts = post_count[n]
    remove = [n for n in G.nodes if post_count[n] <= cutoff and n not in sublist or n == '[deleted]']
    colors = {n: '#FF7F24' if user_colors[n] == 1 else
                '#3D59AB' if user_colors[n] == 0 else 
                '#800000' for n in G.nodes}
    G.remove_nodes_from(remove)

    pos = nx.spring_layout(G, k=0.23)
    user_subs = {}
    for u in G.edges(keys=True):
        if u[2] == 0 and not G.has_edge(u[0], u[1], key = 1):
            user_subs[u[0]] = user_subs.get(u[0], []) + [u[1]]
        elif u[2] == 1:
            user_subs[u[0]] = user_subs.get(u[0], []) + [u[1]]

    nodes = [{'name': str(i), 'color': colors[i], 
            'size': calc_size(i, post_count, max_posts),
            'posts': post_count[i],
            'mis': mis_posts[i],
            'subs': user_subs[i],
            'sub': 0,
            'x': (pos[i][0]+1) * (2000/4),
            'y': (pos[i][1]+1)*(2000/4)} for i in G.nodes() if i not in sublist]
    subs = [{'name': str(i), 'color': colors[i], 
            'size': calc_size(i, post_count, max_posts),
            'posts': post_count[i],
            'mis': mis_posts[i],
            'subs': [i],
            'sub': 1,
            'x': (pos[i][0]+1) * (2000/4),
            'y': (pos[i][1]+1)*(2000/4)} for i in sublist if i in post_count]
    nodes = nodes + subs
    for n in nodes:
        if n['x'] < n['size']:
            n['x'] += n['size']
        if n['y'] < n['size']:
            n['y'] += n['size']


    user_id = {nodes[n]['name'] : n for n in list(range(len(nodes)))}
    
    links = []
    for u in G.edges(keys=True):
        if u[2] == 0 and not G.has_edge(u[0], u[1], key = 1):
            links += [{'source': user_id[u[0]], 'target': user_id[u[1]], 'mis': 0}]
        elif u[2] == 1:
            links += [{'source': user_id[u[0]], 'target': user_id[u[1]], 'mis': 1}]
    

    with open('graph.json', 'w') as f:
        json.dump({'nodes': nodes, 'links': links}, f, indent=4,)

def calc_size(n, post_count, max_posts):
    size = sub_size
    if n not in sublist:
        oldRange = max_posts - cutoff
        newRange = size_range[1] - size_range[0]
        size =  int(math.ceil((((post_count[n] - cutoff) * newRange) / oldRange) + size_range[0]))
    return size




if __name__ == '__main__':
    targets = sys.argv[1:]
    main(targets)
