const popularCities = async () => {
  const res = await fetch("http://localhost:4000/api/cities/popular");
  const data = res.json();

  return data;
};

export { popularCities };
