import axios from "axios";

// retrieve server relevant options
function retrieveOptions(options) {
  let serverOptions = {};
  // Note: can use for loop with array
  serverOptions.mongodb = options.mongodb;
  return serverOptions;
}

function formGithubURL(username, repo) {
  return "https://github.com/" + username + "/" + repo;
}

async function post(querry, data, options) {
  let resp = null;
  let tf = null;
  let error = null;
  if (data.username !== undefined) {
    let url = formGithubURL(data.username, data.repo);

    try {
      tf = (
        await axios.get(
          "https://truckfactor-api.herokuapp.com/truck?giturl=" + url
        )
      ).data.tf;
      tf = parseInt(tf);
      if (isNaN(tf)) {
        // console.log("we didn't get a number here")
        tf = 0;
      }
    } catch (e) {
      error = e;
      console.error("Failed tf calculation");
    }
  }
  // console.log("the url of the github", url, tf)
  data.options = retrieveOptions(options);
  try {
    resp = (await axios.post("/" + querry, data)).data;
    resp.tf = tf;
   //  console.log("axios post lookup",querry, data)
  } catch (e) {
    error = e;
    console.error("Failed querry!");
  }
  return { resp, error };
}

const lookup = async (userInfo, options) =>
  await post("lookup", userInfo, options);
const search = async (querry, options) =>
  await post("search", { querry: querry }, options);

export { lookup, search };
