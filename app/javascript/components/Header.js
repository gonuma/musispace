import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addSong, removeSong } from "../redux/songListSlice";
import { Grid, Button } from "@material-ui/core";

export default function Header(props) {
  const { api_key, resultLimit } = props;
  const { songList } = useSelector((state) => state.songList);
  const dispatch = useDispatch();

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
          console.log(thumbnail);
          let url = res.items[0].id.videoId;
          dispatch(
            addSong({
              band: band,
              title: title,
              url: url,
              img_url: thumbnail,
            })
          );
          axios.post("/api/v1/songs", {
            band: band,
            title: title,
            url: url,
            img_url: thumbnail,
          });
        });
    } else {
      console.error("Please enter a song and band.");
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <h1 className="header">MusiSpace 2.0</h1>
      </Grid>
      <Grid item style={{ marginLeft: "15%" }}>
        <Button variant="contained" onClick={() => uploadSong()}>
          Post Song
        </Button>
      </Grid>
      <Grid item style={{ marginLeft: "2vw" }}>
        <input placeholder="Band Name" id="bandInput"></input>
      </Grid>
      <Grid item style={{ marginLeft: "2vw" }}>
        <input placeholder="Song Name" id="titleInput"></input>
      </Grid>
    </Grid>
  );
}