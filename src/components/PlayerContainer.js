import React, { useRef, useState, useEffect } from "react";
import {
  Paper,
  Stack,
  Box,
  Slider,
  Fab,
  IconButton,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  makeFavourite,
  removeFavourite,
  playNextSong,
  playPreviousSong,
} from "../actions";

import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import FavoriteIcon from "@mui/icons-material/Favorite";

const PlayerContainer = () => {
  const [volume, setVolume] = useState(50);
  const [playTime, setPlayTime] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const audioPlayer = useRef(null);
  const [isRepeat, setRepeat] = useState(false);
  const dispatch = useDispatch();

  const appState = useSelector((state) => state);

  let image_url = "";
  let song_name;
  if (appState?.currently_playing.albumId !== undefined) {
    image_url = `https://api.napster.com/imageserver/v2/albums/${appState?.currently_playing.albumId}/images/200x200.jpg`;
    song_name = appState?.currently_playing.name;
  }

  useEffect(() => {
    audioPlayer.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (audioPlayer.current.src !== "") {
      setPlayTime(0);
      audioPlayer.current.play();
      setPlaying(true);
    }
  }, [appState.currently_playing]);

  const changeVolume = (_, volume) => {
    setVolume(volume);
  };

  const changePlayTime = (_, playTime) => {
    audioPlayer.current.currentTime = playTime;
    setPlayTime(playTime);
  };

  const updatePlayTimeAudioPlayer = (e) => {
    setPlayTime(e.target.currentTime);
  };

  const stopPlaying = () => {
    setPlaying(false);
    setPlayTime(0);
    playNext();
  };

  const playNext = () => {
    dispatch(playNextSong());
  };

  const playPrevious = () => {
    dispatch(playPreviousSong());
  };

  const togglePlayPause = () => {
    setPlaying((currentState) => {
      const newState = !currentState;

      if (newState) {
        audioPlayer.current.play();
      } else {
        audioPlayer.current.pause();
      }
      return newState;
    });
  };

  const toggleRepeat = () => {
    setRepeat((currentState) => {
      const newState = !currentState;
      audioPlayer.current.loop = newState;
      return newState;
    });
  };

  const toggleFavourite = () => {
    if (appState.favourite_list[appState.currently_playing.id] === undefined) {
      dispatch(makeFavourite(appState.currently_playing));
    } else {
      dispatch(removeFavourite(appState.currently_playing.id));
    }
  };

  const controlButtonsTheme = {
    fontSize: "1.5rem",

    "@media (max-width:600px)": {
      fontSize: "1rem",
      // display: "none",
    },
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100vw",
        zIndex: 1300,
      }}
      elevation={12}
    >
      <audio
        ref={audioPlayer}
        src={appState?.currently_playing?.previewURL}
        onTimeUpdate={updatePlayTimeAudioPlayer}
        onEnded={stopPlaying}
      />
      <Slider
        aria-label="time-indicator"
        size="small"
        value={playTime}
        min={0}
        max={30}
        onChange={changePlayTime}
        sx={{
          mt: -3,
          color: "light" === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
          height: 6,
          "& .MuiSlider-thumb": {
            width: 8,
            height: 8,
            "&:before": {
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            },
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0px 0px 0px 8px ${
                "light" === "dark"
                  ? "rgb(255 255 255 / 16%)"
                  : "rgb(0 0 0 / 16%)"
              }`,
            },
            "&.Mui-active": {
              width: 20,
              height: 20,
            },
          },
          "& .MuiSlider-rail": {
            opacity: 0.28,
          },
        }}
      />
      <Stack
        direction="row"
        sx={{ pb: 2, pl: 2, pr: 4 }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          sx={{
            width: "45%",
            height: "3em",
            display: "flex",
            // justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: "2vw",
            "@media (max-width:600px)": {
              width: "40%",
            },
          }}
        >
          <img height="55vh" src={image_url} alt="" />
          <Typography
            varient="h6"
            sx={{
              fontSize: "1rem",
              "@media (max-width:600px)": {
                fontSize: "0.7rem",
              },
            }}
          >
            {song_name?.slice(0,15)}
          </Typography>
        </Box>

        <Box
          sx={{
            pl: "auto",
            width: "50%",
            "@media (max-width:600px)": {
              width: "70%",
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              display: "flex",
              fontSize: "1.5rem",
              "@media (min-width:600px)": {
                gap: "0",
                fontSize: "2rem",
              },
            }}
          >
            <IconButton aria-label="delete" onClick={toggleFavourite}>
              {appState.favourite_list[appState.currently_playing.id] ===
              undefined ? (
                <FavoriteBorderIcon sx={controlButtonsTheme} />
              ) : (
                <FavoriteIcon sx={controlButtonsTheme} />
              )}
            </IconButton>

            <IconButton aria-label="delete" onClick={playPrevious}>
              <SkipPreviousIcon sx={controlButtonsTheme} />
            </IconButton>

            <Fab
              color="primary"
              aria-label="add"
              onClick={togglePlayPause}
              sx={{
                margin: "0.5em",
              }}
            >
              {isPlaying ? (
                <PauseIcon sx={{ fontSize: "2em" }} />
              ) : (
                <PlayArrowIcon sx={{ fontSize: "2em" }} />
              )}
            </Fab>

            <IconButton aria-label="delete" onClick={playNext}>
              <SkipNextIcon sx={controlButtonsTheme} />
            </IconButton>

            <IconButton aria-label="delete" onClick={toggleRepeat}>
              {isRepeat ? (
                <RepeatOnIcon sx={controlButtonsTheme} />
              ) : (
                <RepeatIcon sx={controlButtonsTheme} />
              )}
            </IconButton>
          </Stack>
        </Box>

        <Box
          sx={{
            width: "10rem",
            "@media (max-width:600px)": {
              display: "none",
            },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
            <VolumeDown />
            <Slider
              aria-label="Volume"
              value={volume}
              onChange={changeVolume}
            />
            <VolumeUp />
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default PlayerContainer;
