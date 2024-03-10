const userUrl = "https://www.themealdb.com/api/json/v1/1/search.php?f=f";

const container = document.querySelector(".container");
const favs = document.getElementById("favs");
const mainDiv = document.getElementById("main");
const favsDiv = document.getElementById("favs");

//puts into favs
const updateMealRecipes = (id, direction) => {
  const meal = document.getElementById(id);

  const parentDiv = meal.parentElement;
  console.log(parentDiv);
  if (direction === "toFavs" && parentDiv === mainDiv) {
    favsDiv.appendChild(meal);
  } else if (direction === "toMain" && parentDiv === favsDiv) {
    mainDiv.appendChild(meal);
  }
};

const addClickHandlers = () => {
  const allMeals = document.querySelectorAll(".meal");
  // console.log(allMeals);
  allMeals.forEach((meal) => {
    meal.addEventListener("click", (e) => {
      const parentId = meal.parentNode.id;
      const mealId = meal.id;
      const direction = parentId === "main" ? "toFavs" : "toMain";
      updateMealRecipes(mealId, direction);
    });
  });
  console.log(allMeals);
};

//populates the cards

async function fetchData() {
  return fetch(userUrl)
    .then((response) => response.json())
    .then((data) => data.meals);
}

async function loadData(req) {
  return Promise.resolve(req).then((meals) => {
    createCountersCard(meals);
    buildCards(meals);
    setUpEvents();
    addClickHandlers();
  });
}

const getMeals = async () => {
  try {
    await loadData(fetchData());
  } catch (err) {
    console.log(err);
  }
};
getMeals();

const buildCards = (data) => {
  for (const meal of data) {
    const mealCard = document.createElement("div");
    mealCard.classList.add("card", "meal");
    mealCard.id = meal.idMeal;
    mealCard.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3 class= "mealTitle">${meal.strMeal}</h3>
        <h3>${meal.strCategory}</h3>
        <h3>${meal.strArea}</h3><hr>
        <h3>${meal.strInstructions.slice(0, 30)}...</h3>
        <h3>${meal.strInstructions.slice(0, 100)}...</h3> `;
    container.appendChild(mealCard);
  }
  console.log(container);
};

function setUpEvents() {
  const allMealz = document.querySelectorAll(cardSelector);
  const sortData = (direction) => {
    const mealArray = Array.from(allMealz);

    const sortedMeals = mealArray.sort((a, b) => {
      if (direction === "asc") {
        return a.childNodes[3].textContent > b.childNodes[3].textContent
          ? 1
          : -1;
      } else {
        return b.childNodes[3].textContent < a.childNodes[3].textContent
          ? -1
          : 1;
      }
    });
    sortedMeals.forEach((meal) => meal.parentElement.appendChild(meal));
  };
  sortBtn.forEach((button) => {
    button.addEventListener("click", () => {
      const sortDir = button.dataset.sortdir;
      sortData(sortDir);
    });
  });
}
const sortBtn = document.querySelectorAll(".sortBtn");
const cardSelector = ".card";

const createCountersDataObject = (data) => {
  const resObj = {};
  for (let meal of data) {
    let sum = 0;
    for (let prop in meal) {
      if (prop.startsWith("strIngredient") && meal[prop] && meal[prop].length) {
        sum++;
      }
    }
    if (!resObj[sum.toString()]) {
      resObj[sum.toString()] = 1;
    } else {
      resObj[sum.toString()] = resObj[sum.toString()] + 1;
    }
  }
  return resObj;
};

const totalContainer = document.querySelector(".totalContainer");
const total = document.getElementById("total");

const createCountersCard = (data) => {
  const countersData = createCountersDataObject(data);
  console.log(countersData);
  for (let counter in countersData) {
    const totalHeader = document.createElement("div");
    totalHeader.classList.add("totalCard");
    totalHeader.id = total.id;
    totalHeader.innerHTML = `<div>There are ${countersData[counter]} recipes with ${counter} ingredients.<div>`;
    totalContainer.appendChild(totalHeader);
  }
  console.log(totalContainer);
};

const countersData = {
  1: 4,
  2: 9,
  3: 6,
  4: 18,
  5: 12,
};
const makeTotalCards = (countersData) => {
  for (let counter in countersData) {
    makeTotalCards(counter, countersData[counter]);
  }
};










