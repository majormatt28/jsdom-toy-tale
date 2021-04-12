let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const toyBox = document.querySelector('#toy-collection')

function renderOneToy (toyObj) {
  const outerDiv = document.createElement('div')
  outerDiv.classList.add ('card')
  outerDiv.dataset.id = toyObj.id

  outerDiv.innerHTML = `
  <h2>${toyObj.name}</h2>
  <img src='${toyObj.image}' class="toy-avatar" />
  <p> ${toyObj.likes} </p>
  <button class="like-btn">Like <3</button>`
  
  toyBox.append(outerDiv)
}

function renderAllToys () {
  fetch ('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toyArr => {
      toyArr.forEach(toyObject => {
        renderOneToy(toyObject)
      })
    })
}

renderAllToys()

const form = document.querySelector('.add-toy-form')

form.addEventListener('submit', (event) => {
  
  event.preventDefault()
  
  const name = event.target.name.value
  const image = event.target.image.value
  // const likes = event.target.likes.value

  const newToyObj = {name, image, likes: 0}
  
  fetch ('http://localhost:3000/toys',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newToyObj)
  })
      .then(response => response.json())
      .then(newToyObject => {
        renderOneToy(newToyObject)
      })

      form.reset()
})

toyBox.addEventListener('click', (event) => {
  if (event.target.className === 'like-btn') {
    const cardDiv = event.target.closest('div.card')
    const likesPTag = cardDiv.querySelector('p')
    const currLikes = parseInt(likesPTag.textContent)
    likesPTag.textContent = `${currLikes + 1}`

    fetch (`http://localhost:3000/toys/${cardDiv.dataset.id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: currLikes + 1})
  })
      .then(response => response.json())
      .then(data => {
        likesPTag.textContent = `${data.likes}`
      })
  }
})