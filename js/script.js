document.addEventListener("DOMContentLoaded", function () {

    let body = document.querySelector("body"),
        sidebar = body.querySelector(".sidebar"),
        toggle = body.querySelector(".toggle"),
        searchBtn = body.querySelector(".search-box"),
        modeSwitch = body.querySelector(".toggle-switch"),
        modeText = body.querySelector(".mode-text");

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        enableTransitions();
    });

    searchBtn.addEventListener("click", () => {
        sidebar.classList.remove("close");
        enableTransitions();
    });

    function enableTransitions() {
        const noTransitionElement = document.getElementById("no-transition");
        if (noTransitionElement) {
            noTransitionElement.parentNode.removeChild(noTransitionElement);
        }
    }

    function disableTransitions() {
        const styleElement = document.createElement('style');
        styleElement.id = 'no-transition';
        styleElement.innerHTML = `* {transition: none !important;}`;
        document.head.appendChild(styleElement);
    }

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        body.classList.add(savedTheme);

        if (body.classList.contains("dark")) {
            modeText.innerText = "Light Mode"
        } else {
            modeText.innerText = "Dark Mode"
        }

        disableTransitions();
    } else {
        body.classList.add("light");
        localStorage.setItem("theme", "light");
        disableTransitions();
    }

    modeSwitch.addEventListener("click", () => {
        if (body.classList.contains("dark")) {
            body.classList.remove("dark");
            body.classList.add("light");
            modeText.textContent = "Dark Mode";
            localStorage.setItem("theme", "light");
        } else {
            body.classList.remove("light");
            body.classList.add("dark");
            modeText.textContent = "Light Mode";
            localStorage.setItem("theme", "dark");
        }

        enableTransitions();
    });

    const dataJogo = new Date('2023-10-22T16:00:00');

    const minutosGolsInter = [1, 14, 27, 39, 54, 61, 75];
    const minutosGolsSantos = [80];

    function atualizarPlacar() {
        const dataAtual = new Date();

        const minutosPassados = (dataAtual - dataJogo) / (1000 * 60);

        const numJogos = Math.floor(minutosPassados / 90);

        const tempoJogoAtual = minutosPassados - (numJogos * 90);

        const golsInterTotal = (minutosGolsInter.length * numJogos) + minutosGolsInter.filter((minuto) => minuto <= tempoJogoAtual).length;
        const golsSantosTotal = (minutosGolsSantos.length * numJogos) + minutosGolsSantos.filter((minuto) => minuto <= tempoJogoAtual).length;

        const calcularProximoGol = (minutosGol) => {
            let i = 0;
            let minutosProximoGol;

            while (minutosGol[i] < tempoJogoAtual) {
                i++;
            }

            if (i > minutosGol.length - 1) {
                minutosProximoGol = (90 - tempoJogoAtual) + minutosGol[0];
            } else {
                minutosProximoGol = minutosGol[i] - tempoJogoAtual;
            }

            const minutosAjustados = Math.floor(minutosProximoGol);
            const segundosAjustados = Math.floor((minutosProximoGol - minutosAjustados) * 60);

            return `${String(minutosAjustados).padStart(2, '0')}:${String(segundosAjustados).padStart(2, '0')}`;
        }

        const proximoGolInter = calcularProximoGol(minutosGolsInter);
        const proximoGolSantos = calcularProximoGol(minutosGolsSantos);

        let golMaisProximo;

        if (proximoGolInter > proximoGolSantos) {
            golMaisProximo = "santos";
        } else if (proximoGolInter == proximoGolSantos) {
            golMaisProximo = "both";
        } else {
            golMaisProximo = "inter";
        }

        document.getElementById("btnApostarInter").onclick = function () {
            if (golMaisProximo == "inter") {
                alert("Você acertou! O próximo gol será do Internacional.");
            } else {
                alert("Você errou! O próximo gol será do Santos.");
            }
        }

        document.getElementById("btnApostarSantos").onclick = function () {
            if (golMaisProximo == "santos") {
                alert("Você acertou! O próximo gol será do Santos.");
            } else {
                alert("Você errou! O próximo gol será do Internacional.");
            }
        }

        const diaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'][dataAtual.getDay()];
        const mesExtenso = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'][dataAtual.getMonth()];

        const tempoDeJogo = `${String(Math.floor(minutosPassados / (60 * 24))).padStart(2, '0')}d ${String(Math.floor(minutosPassados % (60 * 24) / 60)).padStart(2, '0')}h ${String(Math.floor(minutosPassados % 60)).padStart(2, '0')}m ${String(Math.floor((minutosPassados * 60) % 60)).padStart(2, '0')}s`

        const textoFormatado = `O jogo entre Inter e Santos teve início às 16h do dia 22/10/2023. Ao final do jogo, o placar estava 7 x 1 para o Inter.\n\nHoje é ${diaSemana}, ${dataAtual.getDate()} de ${mesExtenso} de ${dataAtual.getFullYear()}, às ${String(dataAtual.getHours()).padStart(2, '0')}:${String(dataAtual.getMinutes()).padStart(2, '0')}:${String(dataAtual.getSeconds()).padStart(2, '0')}, e o Internacional ainda está amassando o Santos com um belo ${golsInterTotal} a ${golsSantosTotal}.`;

        const textoProximoGol = `O próximo gol do Internacional será em: ${proximoGolInter}.\nO próximo gol do Santos será em: ${proximoGolSantos}.`;

        document.getElementById('inter').querySelector('p').textContent = golsInterTotal;
        document.getElementById('santos').querySelector('p').textContent = golsSantosTotal;
        document.getElementById('timer').textContent = `${tempoDeJogo}`;
        document.getElementById("texto").textContent = textoFormatado;
        document.getElementById("proximoGol").textContent = textoProximoGol;
    }

    setInterval(atualizarPlacar, 1000);

    atualizarPlacar();

})
