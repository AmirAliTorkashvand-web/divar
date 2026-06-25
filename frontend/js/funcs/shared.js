const popularCities = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/location");
  const data = res.json();

  return data;
};

const setCityCookie = (city) => {
  const cities = getCityCookie() || [];

  if (!cities.includes(city)) {
    cities.push(city);
  }

  document.cookie = `city=${JSON.stringify(cities)}; path=/`;
};

const getCityCookie = () => {
  const cookieName = "city=";
  const cookieArray = document.cookie.split(";");

  let result = [];

  cookieArray.forEach((cookie) => {
    cookie = cookie.trim();

    if (cookie.startsWith(cookieName)) {
      const value = cookie.substring(cookieName.length);

      try {
        result = JSON.parse(value);
      } catch {
        result = [];
      }
    }
  });

  return result.length ? result : null;
};

const getAllCities = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/location/");
  const data = await res.json();

  return data;
};

const getAllSocials = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/social");
  const data = await res.json();

  return data;
};

const getPosts = async (cityID) => {
  const res = await fetch(`https://divarapi.liara.run/v1/post/?city=${cityID}`);
  const data = await res.json();

  return data;
};

export {
  popularCities,
  setCityCookie,
  getCityCookie,
  getAllCities,
  getAllSocials,
  getPosts,
};
