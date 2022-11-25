import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function cleanHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function onCountryInput() {
  const trimmedValue = input.value.trim();
  cleanHtml();
  if (trimmedValue !== '') {
    fetchCountries(trimmedValue).then(foundData => {
      if (foundData.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (foundData.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (foundData.length >= 2 && foundData.length <= 10) {
        renderCountryList(foundData);
      } else if (foundData.length === 1) {
        renderOneCountry(foundData);
      }
    });
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-list__item">
      <img class="country-list__img" src="${country.flags.svg}" alt="Flag of ${country.name.official}">
         <p class="country-list__text">${country.name.official}</p>
                </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `<ul class="country-info-list">
      <li class="country-info-list__item">
      <img class="country-info-list__img" src="${
        country.flags.svg
      }" alt="Flag of ${country.name.official}">
         <p class="country-info-list__title">${country.name.official}</p>
            <p class="country-info-list__description"><b>Capital</b>: ${
              country.capital
            }</p>
            <p class="country-info-list__description"><b>Population</b>: ${
              country.population
            }</p>
            <p class="country-info-list__description"><b>Languages</b>: ${Object.values(
              country.languages
            )} </p>
                </li></ul>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
