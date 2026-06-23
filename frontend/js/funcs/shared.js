const popularCities = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/location");
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
  const res = await fetch("https://divarapi.liara.run/v1/location/");
  const data = await res.json();

  return data;
};

const getAllSocials = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/social");
  const data = await res.json();

  return data;
};

export {
  popularCities,
  setCityCookie,
  getCityCookie,
  getAllCities,
  getAllSocials,
};
