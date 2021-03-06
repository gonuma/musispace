import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addSong, removeSong } from "../redux/songListSlice";
import { Grid, Button, Box, Typography } from "@material-ui/core";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default function Header(props) {
  const { api_key, resultLimit } = props;
  const { songList } = useSelector((state) => state.songList);
  const dispatch = useDispatch();

  let currentUser = document
    .getElementById("username")
    .innerText.split("e, ")[1]
    .split("!")[0];

  let currentUserId = Number(document.getElementById("userId").innerText);

  const uploadSong = () => {
    if (
      document.getElementById("bandInput").value !== "" &&
      document.getElementById("titleInput").value !== ""
    ) {
      let band = document.getElementById("bandInput").value;
      let title = document.getElementById("titleInput").value;
      document.getElementById("bandInput").value = null;
      document.getElementById("titleInput").value = null;

      let urlQuery =
        band.toLowerCase().replaceAll(" ", "%20") +
        "%20" +
        title.toLowerCase().replaceAll(" ", "%20");

      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${resultLimit}&q=${urlQuery}&key=${api_key}`
      )
        .then((res) => res.json())
        .then((res) => {
          let thumbnail = res.items[0].snippet.thumbnails.medium.url;
          thumbnail = thumbnail.split("vi/")[1].split("/")[0];
          let url = res.items[0].id.videoId;
          dispatch(
            addSong({
              band: band,
              title: title,
              url: url,
              poster: currentUser,
              img_url: thumbnail,
            })
          );
          axios.post("/api/v1/songs", {
            band: band,
            title: title,
            url: url,
            poster: currentUser,
            img_url: thumbnail,
          });
        });
    } else {
      console.error("Please enter a song and band.");
    }
  };

  return (
    <Grid container>
      {/* <Box style={{ marginTop: "1vh" }}> */}
      <Grid item style={{ marginTop: "0.3vh", marginLeft: "8%" }}>
        <Button
          variant="contained"
          style={{ color: "white", backgroundColor: "darkslategray" }}
          onClick={() => uploadSong()}
        >
          <AddBoxIcon></AddBoxIcon>
        </Button>
      </Grid>
      <Grid item style={{ marginTop: "0.75vh", marginLeft: "2vw" }}>
        <input
          style={{ width: "25vw" }}
          placeholder="Band Name"
          id="bandInput"
        ></input>
      </Grid>
      <Grid item style={{ marginTop: "0.75vh", marginLeft: "2vw" }}>
        <input
          style={{ width: "25vw" }}
          placeholder="Song Name"
          id="titleInput"
        ></input>
      </Grid>
    </Grid>
  );
}
