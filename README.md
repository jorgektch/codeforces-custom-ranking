# Codeforces Custom Ranking

This project is a custom ranking system for Codeforces users that fetches the user's rating and rank information from the Codeforces API and displays it in a table. Additionally, it visualizes the rankings with a bar chart using `Chart.js`.

## Features

- Fetches data for multiple users using their handles from Codeforces.
- Displays user data including handle, rating, and rank in a sortable table.
- Shows a bar chart visualizing the ratings of all users.
- Highlights users' rating ranges with annotations on the chart.
- Displays a loading message during data fetching.
- Shows the date and time when the data was fetched.

## Technologies Used

- **HTML**: Structure of the webpage.
- **CSS**: Styling the webpage.
- **JavaScript**: Fetches and processes user data from the Codeforces API, updates the table, and creates the bar chart.
- **Chart.js**: Used for creating the bar chart to visualize the user rankings.
- **CryptoJS**: Used for generating the signature for the Codeforces API request.