// class TourManager{

//     this.City=[];
//     this.location;
//     this.venue;
//     this.date;


//       async init() {
//     await this.loadDates();
//     this.bindEvents();
//   }

//   async loadDates() {
//     try {
//       const response = await fetch('../data/tourDates.json');
//       const data = await response.json();
//       this.products = data.products;
//       this.filteredProducts = [...this.products];
//     } catch (error) {
//       console.error('Error loading products:', error);
//       this.showError('Failed to load products. Please refresh the page.');
//     }
//   }


// }

fetch('../data/tourDates.json')
  .then(response => response.json())
  .then(data => {
    const tourCardsContainer = document.getElementById('tour-cards-container');

    data.forEach(tour => {
      // Create card
      const tourCard = document.createElement('div');
      tourCard.classList.add('tour-card');

      // Fill card content
      tourCard.innerHTML = `
        <h2 class="vertical-text">LOCATIONS</h2>
        <h3>City/Town:</h3><p> ${tour.City}</p>
        <h5>Location: ${tour.location}</h5>
        <p>Venue: ${tour.venue}</p>
        <h6>Date: ${tour.date}</h6>
      `;

      // Append card
      tourCardsContainer.appendChild(tourCard);
    });
  })
  .catch(error => console.error('Error fetching tour dates:', error));
// This code fetches tour dates from a JSON file and displays them in a card format on the webpage.