import { useEffect, useState } from "react";
import { fetchWeather, url } from "../js/api";

function Logo() {
  return (
    <a href="#" className="logo">
      <img src="/images/logo.png" alt="logo" width="64px" height="58px" />
    </a>
  );
}

function SearchItem({ name, lat, lon, country, state }) {
  const [view, setview] = useState();
  const [view1, setview1] = useState();

  const toggleSearch = () => {
    view.classList.toggle("active");
    view1.classList.remove("active");
  };

  useEffect(() => {
    const searchView = document.querySelector("[data-search-view]");
    const searchresult = document.querySelector("[data-search-result]");
    setview(searchView);
    setview1(searchresult);
  }, []);
  return (
    <li className="view-item">
      <span className="m-icon">location_on</span>
      <div>
        <p className="item-title">{name}</p>
        <p className="label-2 item-subtitle">
          {state || ""}, {country}
        </p>
      </div>
      <a
        href={`#/weather?lat=${lat}&lon=${lon}`}
        className="item-link has-state"
        aria-label={`${name} weather`}
        data-search-toggler
        onClick={toggleSearch}
      ></a>
    </li>
  );
}

function SearchView() {
  const [searchField, setSearchField] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeoutDuration = 500;
  let searchTimeout = null;

  const handleSearchInput = (event) => {
    setSearchField(event.target.value);
  };

  useEffect(() => {
    let called = false;
    clearTimeout(searchTimeout);

    const searchView = document.querySelector("[data-search-view]");
    const searchTogglers = document.querySelectorAll("[data-search-toggler]");
    const toggleSearch = () => {
      if (!called) {
        searchView.classList.toggle("active");
      }
    };

    const addEventOnElements = (elements, eventType, callback) => {
      for (const element of elements) {
        element.addEventListener(eventType, callback);
      }
    };
    addEventOnElements(searchTogglers, "click", toggleSearch);

    const searchfield = document.querySelector("[data-search-field]");
    const searchresult = document.querySelector("[data-search-result]");

    if (!searchfield.value) {
      searchresult.classList.remove("active");
      searchfield.classList.remove("searching");
    } else {
      searchfield.classList.add("searching");
    }
    if (searchField) {
      searchTimeout = setTimeout(async () => {
        searchfield.classList.remove("searching");

        searchresult.classList.add("active");
        try {
          const response = await fetchWeather(url.geo(searchField));
          const locations = response; // Assuming the response contains an array of locations
          setSearchResults(locations);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }, searchTimeoutDuration);
    }
    return () => {
      called = true;

      clearTimeout(searchTimeout);
    };
  }, [searchField]);

  return (
    <div className={`search-view `} data-search-view>
      <div className="search-wrapper">
        <input
          type="search"
          name="search"
          placeholder="Search City..."
          className="search-field"
          autoComplete="off"
          data-search-field
          value={searchField}
          onChange={handleSearchInput}
        />
        <span className="m-icon leading-icon">Search</span>
        <button
          className="icon-btn leading-icon has-state"
          aria-label="close search"
          data-search-toggler
        >
          <span className="m-icon">arrow_back</span>
        </button>
      </div>

      <div className="search-result" data-search-result>
        <ul className="view-list" data-search-list>
          {searchResults &&
            searchResults.map(({ name, lat, lon, country, state }) => {
              return (
                <SearchItem
                  key={`${lat}-${lon}`}
                  name={name}
                  lat={lat}
                  lon={lon}
                  country={country}
                  state={state}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
}

function HeaderAction() {
  return (
    <div className="header-actions">
      <button
        className="icon-btn has-state"
        aria-label="open search"
        data-search-toggler
      >
        <span className="m-icon icon">search</span>
      </button>
      <a
        href="#/current-location"
        className="btn-primary has-state"
        data-current-location-btn
      >
        <span className="m-icon">my_location</span>
        <span className="span">Current Location</span>
      </a>
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="container">
        <Logo />
        <SearchView />
        <HeaderAction />
      </div>
    </header>
  );
}

export default Header;
