'use strict';
const express = require('express');
const path = require('path');
const logger = require('morgan');
const movies = require('./movies.json');

const app = express();
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/movies', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');

    let {page, pageSize, search} = req.query;

    // Convert page and pageSize to numbers
    page = parseInt(page);
    pageSize = parseInt(pageSize);

    // Check if page and pageSize are valid numbers
    if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
        return res.status(400).json({error: 'Invalid page or pageSize'});
    }

    let filteredMovies = movies;

    // Apply search filter if search query parameter is provided
    if (search) {
        const searchQuery = search.toLowerCase();
        filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchQuery));
    }

    // Calculate the starting and ending indexes based on the requested page and page size
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

    res.json({
        results: paginatedMovies,
        total: filteredMovies.length,
    });
});

app.get('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.send(movies.filter(movie => movie.id === req.params.id));
});

app.listen(3000, function () {
    console.log(`app listening on port ${3000}!`);
});

module.exports = app;
