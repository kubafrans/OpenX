// Retrieve user data
const usersUrl = 'https://fakestoreapi.com/users';
fetch(usersUrl)
  .then((response) => response.json())
  .then((users) => {
    // Retrieve product data
    const productsUrl = 'https://fakestoreapi.com/products';
    fetch(productsUrl)
      .then((response) => response.json())
      .then((products) => {
        // Retrieve cart data
        const cartsUrl =
          'https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07';
        fetch(cartsUrl)
          .then((response) => response.json())
          .then((carts) => {
            // Create a data structure containing all available product categories and the total value of products of a given category
            const categories = {};
            products.forEach((product) => {
              if (categories[product.category]) {
                categories[product.category] += product.price;
              } else {
                categories[product.category] = product.price;
              }
            });
            // Find a cart with the highest value, determine its value and full name of its owner
            const mostExpensiveCart = { userId: null, totalValue: 0 };
            carts.forEach((cart) => {
              let totalPrice = 0;
              const currentUser = cart.userId;
              cart.products.forEach((product) => {
                const id = products.findIndex(
                  (x) => x.id == product.productId
                );
                totalPrice += products[id].price * product.quantity;
              });
              if (mostExpensiveCart.totalValue < totalPrice) {
                mostExpensiveCart.totalValue = totalPrice;
                mostExpensiveCart.userId = currentUser;
              }
            });

            const userIndex = products.findIndex(
              (x) => x.id == mostExpensiveCart.userId
            );
            console.log(
              `Most expensive cart belongs to: ${users[userIndex].name.firstname} ${users[userIndex].name.lastname} and costs: ${mostExpensiveCart.totalValue}`
            );
            // Find the two users living furthest away from each other
            let furthestUsers = null;
            let maxDistance = 0;
            for (let i = 0; i < users.length - 1; i++) {
              for (let j = i + 1; j < users.length; j++) {
                const distance = calculateDistance(
                  users[i].address.geolocation,
                  users[j].address.geolocation
                );
                if (distance > maxDistance) {
                  maxDistance = distance;
                  furthestUsers = [users[i], users[j]];
                }
              }
            }
            console.log(
              `Furthest users: ${furthestUsers[0].name.firstname} ${furthestUsers[0].name.lastname} and ${furthestUsers[1].name.firstname} ${furthestUsers[1].name.lastname}, distance: ${maxDistance}`
            );
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  })
  .catch((error) => console.log(error));

function calculateDistance(geo1, geo2) {
  const [lat1, lng1] = Object.values(geo1).map(parseFloat);
  const [lat2, lng2] = Object.values(geo2).map(parseFloat);
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
module.exports = calculateDistance;
