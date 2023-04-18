const calculateDistance = require('./script');

test('API endpoint check', async () => {
  const response = await fetch('https://fakestoreapi.com/users');
  const data = await response.json();
  expect(typeof data).toBe('object');

  const response2 = await fetch('https://fakestoreapi.com/products');
  const data2 = await response2.json();
  expect(typeof data2).toBe('object');

  const response3 = await fetch(
    'https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07'
  );
  const data3 = await response3.json();
  expect(typeof data3).toBe('object');
});

test('Categories data structure check', () => {
  const products = [
    { id: 1, category: 'clothing', price: 10 },
    { id: 2, category: 'clothing', price: 20 },
    { id: 3, category: 'electronics', price: 30 },
    { id: 4, category: 'electronics', price: 40 },
  ];

  const categories = {};
  products.forEach((product) => {
    if (categories[product.category]) {
      categories[product.category] += product.price;
    } else {
      categories[product.category] = product.price;
    }
  });

  expect(categories).toEqual({ clothing: 30, electronics: 70 });
});

test('Distance check', () => {
  const geo1 = { lat: 51.509865, lng: -0.118092 };
  const geo2 = { lat: 40.712776, lng: -74.005974 };
  const distance = calculateDistance(geo1, geo2);
  expect(distance).toBeCloseTo(5570.77, 1);
});
