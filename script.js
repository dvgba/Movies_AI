
// Movie List - Popular
async function getMovies() {
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NGVhMzdkZTUwNjU3MjMzZjQxMmNjYzU2NThlZDgxOCIsInN1YiI6IjY0Y2ZhZGM2NTQ5ZGRhMDBmZmE0MzhkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CDVmWfQA5tkUJN2BzWKmWaNuJFT3J4ubPKxuOAlxUBY'
        }
    };
    
    try {
        return fetch('https://api.themoviedb.org/3/movie/popular', options)
        .then(response => response.json())
    }catch(error) {
        console.log(error)
    }
    
}
// Puxar info extra do filme


async function getMoreInfo(id) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NGVhMzdkZTUwNjU3MjMzZjQxMmNjYzU2NThlZDgxOCIsInN1YiI6IjY0Y2ZhZGM2NTQ5ZGRhMDBmZmE0MzhkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CDVmWfQA5tkUJN2BzWKmWaNuJFT3J4ubPKxuOAlxUBY'
            }
    };

    try {
        const data = await fetch('https://api.themoviedb.org/3/movie/' + id, options)
        .then(response => response.json())        
        
        return data
    } catch (error) {
        console.log(error)
    }
}


// Link Trailer
/*async function watch(e) {
    const movie_id = e.currentTarget.dataset.id
    
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NGVhMzdkZTUwNjU3MjMzZjQxMmNjYzU2NThlZDgxOCIsInN1YiI6IjY0Y2ZhZGM2NTQ5ZGRhMDBmZmE0MzhkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CDVmWfQA5tkUJN2BzWKmWaNuJFT3J4ubPKxuOAlxUBY'
        }
    }

    try {
        const data = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos`, options)
        .then(response => response.json())

        const { results } = data 

        const youtubeVideo = results.find(video => video.type === "Trailer")

        window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, 'blank')

    } catch (error) {
        console.log(error)
    }
}*/


function createMovieLayout({
    id,
    title,
    stars,
    image,
    time,
    year

}) {
    return `
    <div class="movie">
        <div class="title">
            <span>${title}</span>
            <div>
                <img src="Assets/Star.png" alt="">
                <p>${stars}</p>
            </div>
        </div>

        <div class="poster">
            <img src="https://image.tmdb.org/t/p/w500${image}" alt="Imagem de ${title}">
        </div>

        <div class="info">
            <div class="duration">
                <img src="Assets/Clock.png" alt="">
                <span>${time}</span>
            </div>
            <div class="year">
                <img src="Assets/CalendarBlank.png" alt="">
                <span>${year}</span>
            </div>
        </div>
                
        
    </div>`
}

function selectVideos(results) {
    const random = () => Math.floor(Math.random() * results.length)

    let selectedVideos = new Set()
    while (selectedVideos.size < 3) {
        selectedVideos.add(results[random()].id)

    }

    return [...selectedVideos]
}

function minutesToHourMinutesAndSeconds(minutes) {
    const date = new Date(null)
    date.setMinutes(minutes)
    return date.toISOString().slice(11,19)
}

async function start() {
    // Pega sugestão de filmes da API
    const { results } = await getMovies()
    // Pega randomicamente X filmes para sugestão
    const best = selectVideos(results).map(async movie => {
        // -- Pega as informações extras dos filmes
        const info = await getMoreInfo(movie)

        // -- Organiza os dados para o HTML
        const props = {
            id: info.id,
            title: info.title,
            stars: Number(info.vote_average).toFixed(1),
            image: info.poster_path,
            time: minutesToHourMinutesAndSeconds(info.runtime),
            year: info.release_date.slice(0, 4)
        }

        return createMovieLayout(props)
    })

    const output = await Promise.all(best)


    // Substitui o conteudo dos filmes no Html
    document.querySelector('.movies').innerHTML = output.join("")
}

start() 