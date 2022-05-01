import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import { setPlayNow } from "../actions";

const SongCard = (props) => {
  const dispatch = useDispatch();
  const image_url = `https://api.napster.com/imageserver/v2/albums/${props.data?.albumId}/images/200x200.jpg`;

  const changeSong = () => {
    dispatch(setPlayNow(props.data));
  };

  return (
    <Grid item xs={2} onClick={changeSong} >
      <Paper
        elevation={3}
        sx={[
          { pb: 1, height: "100%" },
          { "&:hover": { backgroundColor: "grey" } },
        ]}
      >
        <Stack
          justifyContent="space-between"
          spacing={3}
          sx={{}}
        >
          <img src={image_url} alt="img" />
          <Typography sx={{ textAlign: "center", justifyContent: "center" }}>
            {props.data?.name.slice(0,22)}
          </Typography>
        </Stack>
      </Paper>
    </Grid>
  );
};

export default SongCard;
