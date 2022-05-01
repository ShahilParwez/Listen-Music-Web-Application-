import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import { NAPSTER_API_KEY } from "../constants";
import ArtistCard from "./ArtistCard";

const TopArtistContainer = () => {
  const [artistList, setArtistList] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.napster.com/v2.2/artists/top?apikey=${NAPSTER_API_KEY}`
      );
      const data = await response.json();
      setArtistList(data.artists);
    })();
  }, []);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {artistList.map((single_artist, idx) => {
          return <ArtistCard data={single_artist} key={idx} />;
        })}
      </Grid>
    </Box>
  );
};

export default TopArtistContainer;
