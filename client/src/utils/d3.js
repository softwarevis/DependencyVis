import auditToColor from "../dataManagers/audit";
import licenseManager from "../dataManagers/license";
import axios from "axios";
import { lookup, search } from "./axios";
import {
  COLOR_OPTION_LOADED,
  COLOR_OPTION_AUDIT,
  COLOR_OPTION_LICENSE,
  SIZE_OPTIONS,
} from "../Options";

const DEFAULT_SIDE_NODE_SIZE = 8;
const DEFAULT_CENTRAL_NODE_SIZE = 10;

// -------------- axiosToD3 -------------- //

async function lookupNewGraph(userInfo, options, err) {
  const { username, repo } = userInfo;
  const { resp, error } = await lookup(userInfo, options);
  if (error) {
    err("Failed lookup!");
    return;
  }

  console.log("Response Data:", resp);

  const mainId = username + "/" + repo;
  const node = createCentralNode(mainId, username, repo, options);
  importData(node, resp);

  const graph = {
    nodes: [node],
    links: [],
  };

  const dependencyNodes = dependenciesToNodes(
    resp.dependencies,
    mainId,
    graph.nodes,
    graph.links,
    options
  );

  //   if (options.loadAhead) {
  for (let node of dependencyNodes.nodes) {
    await lookAtSingle(node, options, err);
  }
  //   }

  return {
    nodes: graph.nodes.concat(dependencyNodes.nodes),
    links: graph.links.concat(dependencyNodes.links),
  };
}

async function searchNewGraph(d, graph, options, err) {
  if (!d.all) {
    lookAtSingle(d, options, err);
  }

  if (!d.all) {
    // lookup failed
    return;
  }

  setLoaded(d);

  // get new graph
  let newGraph = dependenciesToNodes(
    d.all.dependencies,
    d.id,
    graph.nodes,
    graph.links,
    options
  );

  if (options.loadAhead) {
    newGraph.nodes.forEach((node) => {
      lookAtSingle(node, options, err);
    });
  }

  return {
    nodes: graph.nodes.concat(newGraph.nodes),
    links: graph.links.concat(newGraph.links),
  };
}

/* params: name of node to lookup, parent, current graph, options, error callback */
async function addSingle(name, p, graph, options, err) {
  let newNode = _createSideNode({ name: name }, options);
  await lookAtSingle(newNode, options, err);

  const newNodes = [newNode];
  const newLinks = [_createLink(p, newNode)];
  console.log("Add Single", newNodes, newLinks);

  return {
    nodes: graph.nodes.concat(newNodes),
    links: graph.links.concat(newLinks),
  };
}

async function lookAtSingle(d, options, err) {
  if (!d.loaded) d.loaded = {};
  let { resp: data, error } = await search(d.id, options);
  if (error) {
    console.log("Failed Search", d);
    //err("Failed search!");
    d.loaded.failed = true;
    d.loaded.stats = "Could not find source";
    d.loaded.color = "white";
    return;
  }

  data.tf = (
    await axios.get(
      "https://truckfactor-api.herokuapp.com/truck?giturl=https://" +
        getGithubURL(data.username, data.repo)
    )
  ).data.tf;

  d.tf = data.tf;

  console.log("Look At Single Result:", data);
  importData(d, data);
  d.details.source = getGithubURL(data.username, data.repo);
  d.source = d.all.source;

  if (data.dependencies.length === 0) {
    setLoaded(d);
  }
}

function importData(node, data) {
  let importData = {
    size: data.size,
    archived: data.archived,
    license: data.license ? data.license.name : data.license,
    language: data.language,
    forks: data.forks,
    watchers: data.subscribers_count,
    stars: data.stargazers_count,
    openPRs: data.open_pull_request_count,
    closedPRs: data.closed_pull_request_count,
    prMeanTime: data.pull_request_mean_time,
    created: data.created_at,
    updated: data.updated_at,
    truck_factor: data.tf,
  };
  if (!node.details) node.details = {};
  Object.assign(node.details, importData);
  node.all = data;
  if (importData.license) {
    licenseManager.push(importData.license);
  }
}

function setLoaded(node) {
  node.loaded.stats = "Loaded";
  node.loaded.color = "lightblue";
  node.clicked = true;
}

// -------------- nodes -------------- //

function updateNodes(nodes, options) {
  let maxRadius = 0;
  let minRadius = Infinity;
  nodes.forEach((node) => {
    node.color = toNodeColor(node, options);
    if (node.color === "white") node.strokeColor = "black";

    node.radius = toNodeSize(node, options);

    if (node.radius > maxRadius) maxRadius = node.radius;
    if (node.radius < minRadius) minRadius = node.radius;
  });
  maxRadius = Math.max(maxRadius, minRadius + 1);
  return { minRadius, maxRadius };
}

function toNodeColor(data, options) {
  if (data.loaded && data.loaded.failed) return "white";

  switch (options.color) {
    case COLOR_OPTION_LOADED.NAME:
      return data.loaded.color;
    case COLOR_OPTION_AUDIT.NAME:
      return auditToColor(data.audit);
    case COLOR_OPTION_LICENSE.NAME:
      return licenseManager.getColor(data.details.license);

    default:
  }
  return "grey";
}

function toNodeSize(data, options) {
  let option = SIZE_OPTIONS.CHOICES.find((opt) => opt.NAME === options.size);
  // console.log("node size thing: ",option, data.all)
  switch (option.NAME) {
    // put non-default cases here
    case "truck_factor":
       return data.all && data.all.tf ? data.all.tf * 10 : _getDefaultSize(data.isCentral);
      // if (data.all.tf === 1) {
      //   return 12;
      // } else if (data.all.tf === 2) {
      //   return 10;
      // } else if (data.all.tf === 3) {
      //   return 8;
      // } else if (data.all.tf === 4) {
      //   return 6;
      // } else if (data.all.tf === 5) {
      //   return 4;
      // } else if (data.all.tf === 6) {
      //   return 2;
      // } else {
      //   return 1;
      // }

    default:
  }
  return option.KEY
    ? _getDataSizeOrDefault(data.all, option.KEY)
    : _getDefaultSize(data.isCentral);
}

function _getDefaultSize(isCentral) {
  return isCentral ? DEFAULT_CENTRAL_NODE_SIZE : DEFAULT_SIDE_NODE_SIZE;
}

function _getDataSize(node, dataType) {
  return node && node[dataType] ? node[dataType] : undefined;
}

function _getDataSizeOrDefault(node, dataType) {
  return _getDataSize(node, dataType) || DEFAULT_SIDE_NODE_SIZE;
}

function _hasNode(nodes, data) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === data.name) {
      return true;
    }
  }
  return false;
}

function dependenciesToNodes(dependencies, mainNode, nodes, links, options) {
  let newNodes = [];
  let newLinks = [];
  dependencies.forEach((dependency, index, array) => {
    if (!_hasNode(nodes, dependency)) {
      newNodes.push(_createSideNode(dependency, options));
    }
    newLinks.push(_createLink(mainNode, dependency));
  });
  return { nodes: newNodes, links: newLinks };
}

function getGithubURL(username, repo) {
  return "github.com/" + username + "/" + repo;
}

function createCentralNode(id, username, repo, options) {
  let centralNode = {
    id: id,
    isCentral: true,
    radius: 10,
    clicked: true,
    details: {
      source: getGithubURL(username, repo),
    },
    loaded: {
      stats: "Loaded Central Node",
      color: "blue",
    },
  };
  centralNode.color = toNodeColor(centralNode, options);
  centralNode.radius = toNodeSize(centralNode, options);
  console.log("Create central Node:", centralNode);
  return centralNode;
}

function _createSideNode(node, options) {
  let sideNode = {
    id: node.name,
    audit: node.audit,
    //color: toNodeColor(node, options),
    radius: toNodeSize(node, options),
    details: {
      version: node.version,
    },
    info: {
      version: node.version,
    },
    loaded: {
      color: "grey",
    },
  };
  //if (sideNode.color === "white")
  //   sideNode.strokeColor = "black";
  console.log("Create side Node:", sideNode);
  return sideNode;
}

function _createLink(source, target) {
  console.log("Create new link:", source, target);
  let name = target.name || target.id;
  return {
    source: source,
    target: name,
    value: name.length,
  };
}

export {
  createCentralNode,
  lookupNewGraph,
  searchNewGraph,
  addSingle,
  updateNodes,
  getGithubURL,
};
