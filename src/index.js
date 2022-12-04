import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries ';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list');
const inputSearch = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');

function showError(error) {
  console.log(error);
  Notify.failure('Oops, there is no country with that name');
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

function createList(country) {
  const markup = country
    .map(({ name, flags }) => {
      return `<li>
      <img  src="${flags.svg}" width="30" alt="flag of ${name.common}"/>
      <span >${name.official}</span></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function createItem([{ name, capital, population, flags, languages }]) {
  const markupItem = `
  <div>
      <img src="${flags.svg}" alt='${name.common}'>
      <h1>${name.official}</h1>
      <p>'Capital: ${capital}'</p>
      <p>'Population: ${population}'</p>
     
      <p>'Languages: ${Object.values(languages).join(', ')}'</p>
  </div>`;
  countryInfo.innerHTML = markupItem;
}

function handlerInput() {
  let userInfo = inputSearch.value.trim();
  if (userInfo === '') {
    console.log('fill it');
  } else {
    fetchCountries(inputSearch.value.trim())
      .then(country => {
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
        if (country.length > 10) {
          console.log(country, 'length > 10');
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (country.length >= 2 && country.length <= 10) {
          createList(country);
          console.log(country, 'length 2, 10');
        } else if (country.length === 1) {
          Notify.success(
            'You have been looking for this country for all your life'
          );
          createItem(country);
          console.log(country, 'length = 1');
        }
      })
      .catch(showError);
  }
}

inputSearch.addEventListener('input', debounce(handlerInput, DEBOUNCE_DELAY));
