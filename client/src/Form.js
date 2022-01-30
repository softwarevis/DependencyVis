import React from "react";
import {
  Box,
  Text,
  Heading,
  Input,
  Container,
  FormControl,
  Checkbox,
  Center,
  Button,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { lookupNewGraph } from "./utils/d3";
import { AiFillGithub } from "react-icons/ai";
import { Link } from "react-router-dom";
const { useState } = React;

const Form = ({ setGraph, setErrorText, dbOption, setDBOption, options }) => {
  const [owner, setOrg] = useState("");
  const [repo, setRepo] = useState("");
  const [folder, setFolder] = useState("");
  //   const [dbOption, setDBOption] = useState(true);

  var reset = () => {
    setOrg("");
    setRepo("");
    setFolder("");
    setErrorText("");
  };

  var handleSubmit = async (o, r, f = "") => {
    var userInfo = {
      username: o,
      repo: r,
      folder: f,
    };

    console.log("SUBMIT", userInfo);

    setGraph(await lookupNewGraph(userInfo, options, setErrorText));
    reset();
    // TODO: link to vispage
  };
  var handleSubmitEvent = (event) => {
    event.preventDefault();
    if (owner === "" || repo ==="") {
       console.warn('Must enter in owner and repo name')
    }
    else {
      handleSubmit(owner, repo, folder);
    }
  };

  var checkURL = () => {
    const urlQuerry = new URLSearchParams(window.location.search);
    const o = urlQuerry.get("owner");
    const r = urlQuerry.get("repo");
    if (o && r) {
      handleSubmit(o, r);
    }
  };

  checkURL();
  return (
    <Box bgColor="rgb(191, 226, 227)" w="100vw" minHeight="100vh" pt="20em">
      <Box>
        <Heading
          fontSize="4em"
          fontStyle="italic"
          textAlign="center"
          color="rgb(75, 35, 92)"
        >
          DependencyVis
        </Heading>

        <Center>
          <FormControl isRequired w="fit-content" my="5">
            <Stack direction="column" spacing="5">
              <Stack direction="row" spacing="8">
                <Input
                  type="text"
                  value={owner}
                  variant="filled"
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="GitHub owner"
                  isRequired={true}
                />
                <Input
                  type="text"
                  variant="filled"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="GitHub repo"
                  isRequired={true}
                />
              </Stack>

              <Input
                type="text"
                variant="filled"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="optional specified folder"
              />
              <Stack direction="row">
                <Checkbox
                  checked={dbOption}
                  size="lg"
                  value={dbOption}
                  onChange={(e) => setDBOption(e.target.checked)}
                >
                  Use own database?
                </Checkbox>
                <Button type="submit" onClick={(e) => handleSubmitEvent(e)}>
                   <Link to= "/vispage">
                     Search
                   </Link>
                </Button>
              </Stack>
            </Stack>
          </FormControl>
        </Center>
      </Box>

      <Center>
        <Box
          py="2"
          px="10"
          border="1px"
          borderRadius="md"
          borderColor="black"
        >
          <Heading as="h2" my="0.3em">
            Examples:
          </Heading>
          <Stack direction="row" >
            <Stack direction="column" minWidth="300">
              <Text>
                owner:{" "}
                <a href="https://github.com/expressjs/express">expressjs</a>
              </Text>
              <Text>
                owner: <a href="https://github.com/d3/d3">d3</a>
              </Text>
            </Stack>
            <Stack direction="column" minWidth="300">
              <Text>
                repo: <a href="https://github.com/expressjs/express">express</a>
              </Text>
              <Text>
                repo: <a href="https://github.com/d3/d3">d3</a>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Center>

      <Box position='absolute' bottom='5' right='5'>
        <a href="https://github.com/NightLore/DependencyVis">
           <Stack direction='row'>
            <AiFillGithub /> <Text>DependencyVis repository</Text>
           </Stack>
        </a>
      </Box>
    </Box>
  );
};

export default Form;
