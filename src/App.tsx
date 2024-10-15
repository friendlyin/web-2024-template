import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface MovieReview {
  id: number;
  title: string;
  review: string;
}

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: "Comic Sans MS", cursive;
  background-color: #ffff99;
  border: 3px solid #ff00ff;
  box-shadow: 5px 5px 0px #00ffff;
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
    background-color: #ff00ff;
    color: #ffff00;
    font-weight: bold;
    border: 2px solid #00ffff;
    &:hover {
      background-color: #00ffff;
      color: #ff00ff;
    }
  }
`;

const StyledListItem = styled(ListItem)`
  && {
    background-color: #ffffff;
    border: 2px dashed #ff00ff;
    margin-bottom: 1rem;
  }
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 1rem;
    .MuiInputBase-root {
      background-color: #ffffff;
    }
  }
`;

const BlinkingText = styled(Typography)`
  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }
  animation: blink 1s linear infinite;
  color: #ff0000;
  text-shadow: 2px 2px #ffff00;
` as typeof Typography;  // Add this type assertion

function App() {
  const [reviews, setReviews] = useLocalStorageState<MovieReview[]>("movieReviews", {
    defaultValue: [],
  });
  const [newTitle, setNewTitle] = useState("");
  const [newReview, setNewReview] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editReview, setEditReview] = useState("");

  useEffect(() => {
    if (reviews.length === 0) {
      const exampleReviews = [
        { id: 1, title: "Jurassic Park", review: "Dinos are totally rad! Two thumbs up!" },
        { id: 2, title: "The Matrix", review: "Whoa, mind-bending stuff. Cool effects!" },
        { id: 3, title: "Titanic", review: "Epic love story. Bring tissues!" },
      ];
      setReviews(exampleReviews);
    }
  }, [reviews, setReviews]);

  const handleAddReview = () => {
    if (newTitle.trim() !== "" && newReview.trim() !== "") {
      setReviews([
        ...reviews,
        { id: Date.now(), title: newTitle.trim(), review: newReview.trim() },
      ]);
      setNewTitle("");
      setNewReview("");
    }
  };

  const handleDeleteReview = (id: number) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const handleEditReview = (id: number) => {
    setEditingId(id);
    const reviewToEdit = reviews.find((review) => review.id === id);
    if (reviewToEdit) {
      setEditTitle(reviewToEdit.title);
      setEditReview(reviewToEdit.review);
    }
  };

  const handleUpdateReview = (id: number) => {
    if (editTitle.trim() !== "" && editReview.trim() !== "") {
      setReviews(
        reviews.map((review) =>
          review.id === id
            ? { ...review, title: editTitle.trim(), review: editReview.trim() }
            : review
        )
      );
    }
    setEditingId(null);
    setEditTitle("");
    setEditReview("");
  };

  return (
    <AppContainer>
      <BlinkingText variant="h3" component="h1" gutterBottom>
        Totally Awesome Movie Reviews!
      </BlinkingText>
      <StyledTextField
        fullWidth
        variant="outlined"
        label="Movie Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <StyledTextField
        fullWidth
        variant="outlined"
        label="Your Review"
        multiline
        rows={3}
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
      />
      <StyledButton
        variant="contained"
        fullWidth
        onClick={handleAddReview}
      >
        Add Review
      </StyledButton>
      <List>
        {reviews.map((review) => (
          <StyledListItem key={review.id}>
            {editingId === review.id ? (
              <>
                <StyledTextField
                  fullWidth
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  label="Movie Title"
                />
                <StyledTextField
                  fullWidth
                  value={editReview}
                  onChange={(e) => setEditReview(e.target.value)}
                  multiline
                  rows={3}
                  label="Your Review"
                />
                <StyledButton onClick={() => handleUpdateReview(review.id)}>
                  Save
                </StyledButton>
              </>
            ) : (
              <>
                <ListItemText
                  primary={<Typography variant="h6">{review.title}</Typography>}
                  secondary={review.review}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditReview(review.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </>
            )}
          </StyledListItem>
        ))}
      </List>
    </AppContainer>
  );
}

export default App;
