const popularCities = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/location");
  const data = res.json();

  return data;
};

const setCityCookie = (city) => {
  const cities = getCityCookie() || [];

  if (!cities.some((item) => item.id === city.id)) {
    cities.push(city);
  }

  document.cookie = `city=${encodeURIComponent(
    JSON.stringify(cities),
  )}; path=/; max-age=${60 * 60 * 24 * 30}`;
};

const getCityCookie = () => {
  const cookieName = "city=";
  const cookieArray = document.cookie.split(";");

  let result = [];

  cookieArray.forEach((cookie) => {
    cookie = cookie.trim();

    if (cookie.startsWith(cookieName)) {
      const value = decodeURIComponent(cookie.substring(cookieName.length));

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

const getPosts = async (cityID, categoryID, searchValue) => {
  let url = `https://divarapi.liara.run/v1/post/?city=${cityID}`;

  if (categoryID) {
    url += `&categoryId=${categoryID}`;
  }
  if (searchValue) {
    url += `&search=${searchValue}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  return data;
};

const getAllCategories = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/category");
  const data = await res.json();

  return data;
};

const addParamToUrl = (param, value) => {
  const url = new URL(location.href);
  const searchParams = url.searchParams;

  searchParams.set(param, value);
  url.search = searchParams.toString();
  location.href = url.toString();
};

const calcualetRelativeTime = (createdTime) => {
  const currentTime = new Date();
  const postTime = new Date(createdTime);

  const timeDifference = currentTime - postTime;

  const minutes = Math.floor(timeDifference / (60 * 1000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes} دقیقه پیش`;
  } else if (hours < 24) {
    return `${hours} ساعت پیش`;
  } else {
    return `${days} روز پیش`;
  }
};

const getUrlParam = (param) => {
  const urlParam = new URLSearchParams(location.search);
  return urlParam.get(param);
};

const removeParamFromUrl = (param) => {
  const url = new URL(window.location);

  console.log("قبل:", url.search);

  url.searchParams.delete(param);

  console.log("بعد:", url.search);

  window.location = url.toString();
};

const removeCityCookie = (cityName) => {
  const cities = getCityCookie() || [];

  const updatedCities = cities.filter((city) => city.name !== cityName);

  document.cookie = `city=${encodeURIComponent(
    JSON.stringify(updatedCities),
  )}; path=/; max-age=${60 * 60 * 24 * 30}`;
};

const updateCityCookie = (cities) => {
  document.cookie = `city=${encodeURIComponent(
    JSON.stringify(cities),
  )}; path=/; max-age=${60 * 60 * 24 * 30}`;
};

const getPost = async (postID) => {
  const res = await fetch(`https://divarapi.liara.run/v1/post/${postID}`, {
    headers: getToken()
      ? {
          Authorization: `Bearer ${getToken()}`,
        }
      : {},
  });
  const data = await res.json();
  return data;
};

const showSwal = (title, text, icon) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
  });
};

const setCookie = (name, value, days) => {
  const date = new Date();

  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
};

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");

  const cookie = cookies.find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const getToken = () => {
  const userToken = getCookie("user");
  return userToken;
};

const getMe = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/auth/me", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();

  return data;
};

const getAllSubCategories = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/category/sub");
  const data = await res.json();
  return data;
};

const getAllUsersNotes = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/user/notes", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  return data;
};

const getAllUsersPosts = async () => {
  const res = await fetch("https://divarapi.liara.run/v1/user/posts", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  return data;
};

const showSwalQuestion = (
  title,
  text,
  icon,
  confirmCallback,
  cancelCallback,
) => {
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: "تایید",
    cancelButtonText: "لغو",
  }).then((result) => {
    if (result.isConfirmed && confirmCallback) {
      confirmCallback();
    }

    if (result.isDismissed && cancelCallback) {
      cancelCallback();
    }
  });
};

const removeCookie = (cookieName) => {
  document.cookie = `${cookieName}=; path=/; max-age=0`;
};

export {
  popularCities,
  setCityCookie,
  getCityCookie,
  getAllCities,
  getAllSocials,
  getPosts,
  getAllCategories,
  addParamToUrl,
  calcualetRelativeTime,
  getUrlParam,
  removeParamFromUrl,
  removeCityCookie,
  updateCityCookie,
  getPost,
  showSwal,
  setCookie,
  getCookie,
  getMe,
  getToken,
  getAllSubCategories,
  getAllUsersNotes,
  getAllUsersPosts,
  showSwalQuestion,
  removeCookie,
};
