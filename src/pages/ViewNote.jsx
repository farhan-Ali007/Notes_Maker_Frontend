import {
  Box,
  Card,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../styles/Loader";

const ViewNote = ({ darkMode }) => {
  const { id } = useParams();
  const theme = useTheme();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3500/api/note/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setNote(response.data.note);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching note:", error);
        setError("Failed to fetch note");
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!note) {
    return <Typography>No note found.</Typography>;
  }

  const removeImageTags = (html) => {
    return html.replace(/<img[^>]*>/g, ""); 
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "white",
        padding: { xs: "10px", sm: "20px" },
      }}
    >
      <Box
        sx={{
          maxWidth: "800px",
          margin: "auto",
          padding: { xs: "10px", sm: "20px" },
          backgroundColor:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "white",
          borderRadius: {
            xs: "none",
            md: "10px",
          },
          boxShadow: {
            xs: "none",
            md:
              theme.palette.mode === "dark"
                ? "0px 0px 5px 4px #0d80d8"
                : "0px 0px 3px 2px gray",
          },
          mt: {
            xs: "0px",
            md: "20px",
          },
        }}
      >
        {/* Tags */}
        <Box sx={{ marginBottom: "20px", textAlign: "center" }}>
          {note.tag && note.tag.length > 0 && (
            <Chip
              label={note.tag[0]}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.text.primary
                    : note.bgColor,
                fontSize: "1rem",
                color: note.color,
                fontWeight: "bold",
                p: "5px",
              }}
            />
          )}
        </Box>

        <Divider
          sx={{ marginBottom: "20px", backgroundColor: theme.palette.divider }}
        />
        {/* Title */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: "20px",
            fontWeight: "bold",
            color: theme.palette.text.primary,
            textAlign: "center",
          }}
        >
          {note.title}
        </Typography>

        {/* Content */}
        <Typography
          variant="body1"
          component="p"
          sx={{
            mb: "20px",
            whiteSpace: "pre-wrap",
            color: theme.palette.text.secondary,
          }}
          dangerouslySetInnerHTML={{ __html: removeImageTags(note.content) }}
        />

        {/* Images */}
        {note.images && (
          <Grid container spacing={2} sx={{ marginTop: "20px" }}>
            {note.images.map((image, index) => (
              <Grid item xs={12} sm={6} key={image._id || index}>
                <Card>
                  <CardMedia
                    component="img"
                    image={image.url}
                    alt={`Note Image ${index + 1}`}
                    sx={{
                      height: "auto",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Author and Date */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "20px",
            p: "10px 15px",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            Author: {note.author.username}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.primary}>
            Created At: {new Date(note.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewNote;
