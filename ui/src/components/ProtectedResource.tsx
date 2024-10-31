import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  TextField,
  Toolbar,
  Typography,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getCurrentUser, signout } from "../services/auth.service";

function ProtectedResource() {
  let navigate: NavigateFunction = useNavigate();
  const currentUser = getCurrentUser();
  const [cards, setCards] = useState<
    { id: number; title: string; imageUrl: string; rating: number; time: string; place: string; category: string }[]
  >([]);
  const [newCardTitle, setNewCardTitle] = useState<string>("");
  const [newCardImageUrl, setNewCardImageUrl] = useState<string>("");
  const [newCardTime, setNewCardTime] = useState<string>("");
  const [newCardPlace, setNewCardPlace] = useState<string>("");
  const [newCardCategory, setNewCardCategory] = useState<string>("");
  const [searchTitle, setSearchTitle] = useState<string>(""); // Search input for title
  const [categoryFilter, setCategoryFilter] = useState<string>(""); // Category filter
  const [currentEditId, setCurrentEditId] = useState<number | null>(null); // Track the card being edited

  const handleSignOut = () => {
    signout();
    navigate("/signin");
    window.location.reload();
  };

  const handleAddOrEditCard = () => {
    if (newCardTitle.trim() === "" || newCardImageUrl.trim() === "") return;

    if (currentEditId !== null) {
      // If editing, update the card
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === currentEditId
            ? {
                ...card,
                title: newCardTitle,
                imageUrl: newCardImageUrl,
                time: newCardTime,
                place: newCardPlace,
                category: newCardCategory,
              }
            : card
        )
      );
      setCurrentEditId(null); // Exit edit mode
    } else {
      // Otherwise, add a new card
      const newCard = {
        id: Date.now(),
        title: newCardTitle,
        imageUrl: newCardImageUrl,
        rating: 0,
        time: newCardTime,
        place: newCardPlace,
        category: newCardCategory,
      };
      setCards((prevCards) => [...prevCards, newCard]);
    }

    // Clear input fields after adding/editing
    setNewCardTitle("");
    setNewCardImageUrl("");
    setNewCardTime("");
    setNewCardPlace("");
    setNewCardCategory("");
  };

  const handleEditCard = (card: {
    id: number;
    title: string;
    imageUrl: string;
    time: string;
    place: string;
    category: string;
  }) => {
    setCurrentEditId(card.id);
    setNewCardTitle(card.title);
    setNewCardImageUrl(card.imageUrl);
    setNewCardTime(card.time);
    setNewCardPlace(card.place);
    setNewCardCategory(card.category);
  };

  const handleDeleteCard = (id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
    if (currentEditId === id) setCurrentEditId(null); // Exit edit mode if the card being edited is deleted
  };

  const handleRatingChange = (id: number, newRating: number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, rating: newRating } : card
      )
    );
  };

  // Filter cards based on searchTitle and categoryFilter
  const filteredCards = cards.filter((card) => {
    const matchesTitle = card.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesCategory = categoryFilter ? card.category === categoryFilter : true;
    return matchesTitle && matchesCategory;
  });

  return (
    <Box>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Renginiai
          </Typography>
          {currentUser ? (
            <Button color="inherit" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md" sx={{ marginTop: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexDirection: 'column' }}>
          <TextField
            variant="outlined"
            label="Pavadinimas"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            fullWidth
          />
          <TextField
            variant="outlined"
            label="Paveiksliukas"
            value={newCardImageUrl}
            onChange={(e) => setNewCardImageUrl(e.target.value)}
            fullWidth
          />
          <TextField
            variant="outlined"
            label="Laikas"
            value={newCardTime}
            onChange={(e) => setNewCardTime(e.target.value)}
            fullWidth
          />
          <TextField
            variant="outlined"
            label="Vieta"
            value={newCardPlace}
            onChange={(e) => setNewCardPlace(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Kategorija</InputLabel>
            <Select
              value={newCardCategory}
              label="Kategorija"
              onChange={(e) => setNewCardCategory(e.target.value)}
            >
              <MenuItem value="įmonių renginiai">#1 – įmonių renginiai</MenuItem>
              <MenuItem value="socialiniai įvykiai">#2 – socialiniai įvykiai</MenuItem>
              <MenuItem value="ne pelno ir lėšų rinkimo renginiai">Nr. 3 – ne pelno ir lėšų rinkimo renginiai</MenuItem>
              <MenuItem value="Prekybos parodos ir parodos">#4 – Prekybos parodos ir parodos</MenuItem>
              <MenuItem value="Kultūros ir šventiniai renginiai">#5 – Kultūros ir šventiniai renginiai</MenuItem>
              <MenuItem value="edukaciniai renginiai">#6 – edukaciniai renginiai</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddOrEditCard}>
            {currentEditId ? "Išsaugoti" : "pridėkite renginį"}
          </Button>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            label="Ieškoti pagal pavadinimą"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Filtruoti pagal kategoriją</InputLabel>
            <Select
              value={categoryFilter}
              label="Filtruoti pagal kategoriją"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">Visos kategorijos</MenuItem>
              <MenuItem value="įmonių renginiai">#1 – įmonių renginiai</MenuItem>
              <MenuItem value="socialiniai įvykiai">#2 – socialiniai įvykiai</MenuItem>
              <MenuItem value="ne pelno ir lėšų rinkimo renginiai">Nr. 3 – ne pelno ir lėšų rinkimo renginiai</MenuItem>
              <MenuItem value="Prekybos parodos ir parodos">#4 – Prekybos parodos ir parodos</MenuItem>
              <MenuItem value="Kultūros ir šventiniai renginiai">#5 – Kultūros ir šventiniai renginiai</MenuItem>
              <MenuItem value="edukaciniai renginiai">#6 – edukaciniai renginiai</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Display Filtered Cards */}
    {/* Display Filtered Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filteredCards.map((card) => (
            <Card key={card.id} sx={{ width: '100%', maxWidth: 345 }}>
              {card.imageUrl && (
                <CardMedia
                  component="img"
                  alt={card.title}
                  height="140"
                  image={card.imageUrl}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h5">{card.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Laikas: {card.time}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Vieta: {card.place}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Kategorija: {card.category}
                </Typography>
                <Rating
                  value={card.rating}
                  onChange={(event, newValue) => handleRatingChange(card.id, newValue || 0)}
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditCard(card)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default ProtectedResource;