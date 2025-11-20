import './global.css'
import { createIcons, Search, Wind, MapPin, Thermometer, SunSnow } from 'lucide'

createIcons({
	icons: {
		Search,
		Wind,
		MapPin,
		Thermometer,
		SunSnow
	}
})

const searchForm = document.querySelector('#search-form')
const searchResultsMenu = document.querySelector('#search-dropdown-results-menu')
const popOverTrigger = document.querySelector('#search-dropdown-results-trigger')
const popOverElement = document.querySelector('#search-dropdown-results-popover')

searchForm.onsubmit = handleSearch

searchForm.onkeypress = function (e) {
	if (e.keyCode === 13) {
		handleSearch(e)
	}
}
searchResultsMenu.onclick = handleWeatherDetails
const WEATHER_API_KEY = 'T5UKRBPM5PRJHYJ42VD7P8KKP'

async function handleSearch(e) {
	e.preventDefault()

	weatherLocations.length = 0

	const formData = new FormData(searchForm)

	const searchQuery = formData.get('search-query')

	if (!searchQuery) {
		showNoResult()
		return
	}

	let removeLoadingState = showLoadingState()

	const geoCodingUrl = `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`

	const response = await fetch(geoCodingUrl)
	const result = await response.json()

	if (result.length === 0) {
		showNoResult()
		removeLoadingState()
		return
	}

	removeLoadingState()

	createMenuItem(result)
	createLocationRef(result)
}

function showCard() {
	const weatherCard = document.querySelector('#weather-card')

	if (weatherCard.classList.contains('hidden')) {
		weatherCard.classList.remove('hidden')
		weatherCard.classList.add('flex')
	}
}

function showLoadingState() {
	const spinnerState = document.querySelector('#spinner-state-icon')
	const searchState = document.querySelector('#search-state-icon')

	searchState.classList.add('hidden')
	spinnerState.classList.remove('hidden')

	return () => {
		searchState.classList.remove('hidden')
		spinnerState.classList.add('hidden')
	}
}

async function handleWeatherDetails(e) {
	if (weatherLocations.length === 0) return
	closeSearchResults()

	const index = Array.prototype.slice.call(searchResultsMenu.children).indexOf(e.target)

	const locationRef = weatherLocations[index]

	const response = await fetch(
		`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationRef.lat},${locationRef.lng}?key=${WEATHER_API_KEY}`
	)

	const weatherDetails = await response.json()

	showCard()
	displayWeatherDetails(locationRef.name, weatherDetails)
}

function displayWeatherDetails(locationName, weatherDetails) {
	const cardCityTitle = document.querySelector('.city-title')
	const cardWeatherTemp = document.querySelector('#weather-temperature')
	const cardWeatherCondition = document.querySelector('#weather-condition')
	const cardWeatherHumidity = document.querySelector('#weather-humidity')
	const cardWeatherWind = document.querySelector('#weather-wind-speed')

	cardCityTitle.textContent = locationName
	cardWeatherTemp.textContent = `${weatherDetails.currentConditions.temp} °C`
	cardWeatherCondition.textContent = weatherDetails.currentConditions.conditions
	cardWeatherHumidity.textContent = `${weatherDetails.currentConditions.humidity}%`
	cardWeatherWind.textContent = `${weatherDetails.currentConditions.windspeed} km/h`
}

function createLocationRef(locations) {
	weatherLocations.length = 0

	locations.map((location) => {
		console.log(location)

		weatherLocations.push(
			weatherLocation(location.display_name, {
				lat: parseFloat(location.lat),
				lng: parseFloat(location.lon)
			})
		)
	})

	console.log(weatherLocations)
}

function showNoResult() {
	searchResultsMenu.textContent = ''
	const div = document.createElement('div')
	div.role = 'menuitem'
	div.textContent = 'No results found.'
	searchResultsMenu.appendChild(div)

	showSearchResults()
}

function createMenuItem(locations) {
	searchResultsMenu.textContent = ''
	locations.map((location) => {
		const div = document.createElement('div')
		div.role = 'menuitem'
		div.classList.add(
			'hover:bg-gray-100',
			'transition',
			'duration-100',
			'cursor-pointer',
			'dark:hover:bg-[#404040]'
		)

		div.textContent = location.display_name
		searchResultsMenu.appendChild(div)
	})

	showSearchResults()
}

function showSearchResults() {
	popOverTrigger.ariaExpanded = true
	popOverElement.ariaHidden = false
}

function closeSearchResults(params) {
	popOverTrigger.ariaExpanded = false
	popOverElement.ariaHidden = true
}

const weatherLocations = []

const weatherLocation = (locationName, coordinates) => {
	return {
		lat: coordinates.lat,
		lng: coordinates.lng,
		name: locationName
	}
}
