const popularCities = async () => {
  const res = await fetch("http://localhost:4000/api/cities/popular");
  const data = res.json();

  return data;
};

const setCityCookie = (city) => {
  document.cookie = `city=${city}; path=/`;
};

const getCityCookie = () => {
  const cookieName = "city=";
  const cookieArray = document.cookie.split(";");

  let result = null;

  cookieArray.forEach((cookie) => {
    if (cookie.indexOf(cookieName) === 0) {
      result = cookie.substring(cookieName.length);
    }
  });

  return result;
};

const getAllCities = async () => {
  const res = await fetch("http://localhost:4000/api/cities");
  const data = await res.json();

  return data
};

export { popularCities, setCityCookie, getCityCookie, getAllCities };
