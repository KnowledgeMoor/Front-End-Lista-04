window.addEventListener("load", () => {


    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZGZjYTM0NGU5ZGI4NWVmZDdlYzZjM2E0YTk5OWUxMSIsInN1YiI6IjY1ZmI3YjM2M2ZlMTYwMDE2NGYzNThkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j6FocNl7gdygND4Px5whhMQUZLeID-dkwGYBTIQf3pU'
        }
    };


    var language = "pt-br";

    var fetchMovies = fetch(`https://api.themoviedb.org/3/movie/popular?language=${language}&page=1`, options);
    var fetchCategories = fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${language}`, options);
    
    Promise.all([fetchMovies, fetchCategories])
        .then(([response1, response2]) => Promise.all([response1.json(), response2.json()]))
        .then(([filmes, categorias]) => exibirFilmes(filmes, categorias))
        .catch(err => console.error(err));

    function exibirFilmes(filmes, categorias) {

        console.log(filmes.results.slice(0, 10));
        console.log(categorias);
        filmes.results.slice(0, 10).forEach((filme, index) => {


            // Criando elementos

            var box = document.createElement("div");
            var capaDoFilme = document.createElement("img");
            var tituloFilme = document.createElement("p");
            var dataDoFilme = document.createElement("span");
            var avaliacaoDoFilme = document.createElement("p");
            var visualicaoDoFilme = document.createElement("p");
            var generoDoFilme = document.createElement("p");
            var sinopsisDoFilme = document.createElement("div");
            var sinopisConteudo = document.createElement("p");
            var sinopisExpand = document.createElement("button");


            // Modificando os elementos

            capaDoFilme.setAttribute("src", `https://image.tmdb.org/t/p/w500${filme.poster_path}`);

            tituloFilme.textContent = filme.title;

            data = filme.release_date.split('-').reverse();
            ano = data[2];
            dataDoFilme.textContent = " (" + ano + ")";
            dataDoFilme.setAttribute("title", data.join("/"));

            rating = filme.vote_average / 2;
            for (let i = 1; i <= 5; i++) {
                (rating >= i) ? avaliacaoDoFilme.innerHTML += "&#9733" : avaliacaoDoFilme.innerHTML += "&#9734;";
            }
            avaliacaoDoFilme.setAttribute("title", rating.toFixed(2));
            visualicaoDoFilme.innerHTML = "&#x1F441; " + formatarNumero(filme.popularity);
            
            generoDoFilme.textContent = "Gênero(s): ";
            filme.genre_ids.forEach((genero_id, i, vet) => {
                genero = categorias.genres.find(g => g.id === genero_id);
                generoDoFilme.textContent += genero.name;
                if (i < vet.length - 1) {
                    generoDoFilme.textContent += ", ";
                } else {
                    generoDoFilme.textContent += ".";
                }
            });

            if (filme.overview != "") sinopisConteudo.innerHTML = "Descrição: <br><br>" + filme.overview;
            else sinopisConteudo.innerHTML = "Descrição: <br><br>" + "Nenhuma descrição disponível";
            sinopsisDoFilme.setAttribute("class", "summary");
            sinopsisDoFilme.setAttribute("id", `summaryText${index}`);
            sinopisExpand.textContent = "show all";
            sinopisExpand.setAttribute("id", `toggleSummary${index}`);
            sinopisExpand.setAttribute("class", "expand");


            // Adicionando os elementos ao html

            tituloFilme.appendChild(dataDoFilme);
            sinopsisDoFilme.appendChild(sinopisConteudo);
            box.appendChild(capaDoFilme);
            box.appendChild(tituloFilme);
            box.appendChild(avaliacaoDoFilme);
            box.appendChild(visualicaoDoFilme);
            box.appendChild(generoDoFilme);
            box.appendChild(sinopsisDoFilme);
            box.appendChild(sinopisExpand);
            document.getElementById("boxFilmes").appendChild(box);


            // Visibilidade dos divs

            box.classList.add('fade-in');
            setTimeout(() => {
                box.classList.add('visible');
            }, (index + 1) * 150);


            // Adicionando evento de click para expandir as descrições

            document.getElementById(`toggleSummary${index}`).addEventListener("click", function () {
                var summaryDiv = document.getElementById(`summaryText${index}`);
                if (summaryDiv.style.maxHeight) {
                    summaryDiv.style.maxHeight = null;
                    document.getElementById(`toggleSummary${index}`).textContent = "Show All";
                } else {
                    summaryDiv.style.maxHeight = summaryDiv.scrollHeight + "px";
                    document.getElementById(`toggleSummary${index}`).textContent = "Show Less";
                }
            });
        });
    }

    function formatarNumero(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

});