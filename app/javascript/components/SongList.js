import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSong, removeSong } from "../redux/songListSlice";
import { changeSong } from "../redux/currentSongSlice";
import axios from "axios";
import { Grid, Box, Button } from "@material-ui/core";

export default function SongList(props) {
  const { api_key } = props;
  const { songList } = useSelector((state) => state.songList);
  const { currentSong } = useSelector((state) => state.currentSong);
  const dispatch = useDispatch();

  let currentUser = document
    .getElementById("username")
    .innerText.split("e, ")[1]
    .split("!")[0];

  let currentUserId = Number(document.getElementById("userId").innerText);

  const friendList = [];
  useEffect(() => {
    axios.get("/friends.json").then((res) => {
      for (const user of res.data) {
        if (user.user_id === currentUserId) {
          friendList.push(user.username);
        }
      }
    });
  }, []);

  let temp = [...songList];

  const songListSetter = async () => {
    await axios.get("/api/v1/songs").then((res) => {
      // const temp = [];
      for (const track of res.data.data) {
        if (
          track.attributes.poster === currentUser ||
          currentUser === "greggy" ||
          friendList.includes(track.attributes.poster)
        ) {
          dispatch(
            addSong({
              id: track.attributes.id,
              band: track.attributes.band,
              title: track.attributes.title,
              slug: track.attributes.slug,
              poster: track.attributes.poster,
              url: track.attributes.url,
              img_url: track.attributes.img_url,
            })
          );
        }
      }
    });
  };

  const listPopulator = () => {
    return songList.map((song) => {
      return (
        <Grid container justifyContent="center" columnSpacing={1}>
          <Box mb={1}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                style={{ width: "100%" }}
                onClick={() =>
                  dispatch(
                    changeSong({
                      id: song.id,
                      band: song.band,
                      title: song.title,
                      slug: song.slug,
                      poster: song.poster,
                      url: song.url,
                      img_url: song.img_url,
                    })
                  )
                }
              >{`${song.band} - ${song.title}`}</Button>
              <Grid item xs={12}>
                <img
                  style={{ width: "100%", cursor: "pointer" }}
                  src={`https://i.ytimg.com/vi/${song.img_url}/mqdefault.jpg`}
                  onClick={() =>
                    dispatch(
                      changeSong({
                        id: song.id,
                        band: song.band,
                        title: song.title,
                        slug: song.slug,
                        poster: song.poster,
                        url: song.url,
                        img_url: song.img_url,
                      })
                    )
                  }
                />
              </Grid>
            </Grid>
            <Box
              pt={0.5}
              pl={1}
              pb={1}
              mb={1}
              style={{
                backgroundColor: "darkslategray",
                color: "white",
              }}
            >
              <div>{`Posted by: ${song.poster}`}</div>
            </Box>
            <Grid item xs={12}>
              {currentUser === "greggy" ? (
                <Button
                  variant="outlined"
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={() => {
                    axios.delete(`/api/v1/songs/${song.slug}`);
                    for (let i = 0; i < songList.length; i++) {
                      if (song.title === songList[i].title) {
                        temp.splice(i, 1);
                        dispatch(removeSong(temp));
                      }
                    }
                  }}
                >
                  Delete
                </Button>
              ) : (
                <></>
              )}
              <Button
                variant="outlined"
                style={{
                  marginLeft: "0.5vw",
                  backgroundColor: "darkslategray",
                  color: "white",
                }}
                onClick={() => {
                  for (let i = 0; i < songList.length; i++) {
                    if (song.title === songList[i].title) {
                      temp.splice(i, 1);
                      dispatch(removeSong(temp));
                    }
                  }
                }}
              >
                Hide
              </Button>
            </Grid>
          </Box>
        </Grid>
      );
    });
  };

  useEffect(() => {
    listPopulator();
  }, [songList]);

  useEffect(() => {
    songListSetter();
  }, []);

  return (
    <Grid
      container
      id="songList"
      justifyContent="center"
      style={{
        // backgroundColor: "red",
        overflowX: "scroll",
        overflowY: "scroll",
        height: "94.3vh",
      }}
    >
      {/* <Box mb={-1}> */}
      {/* <h1 onClick={() => console.log(songList)}>Recent Songs</h1> */}
      {/* </Box> */}
      {listPopulator()}
    </Grid>
  );
}
