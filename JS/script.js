const tecnicos = [

    {
        nome: "EMERSON SCHIMIDT",
        endereco: "R. Antares, 166 - Cidade Satélite",
        cidade: "São Paulo",
        telefone: "11999999999",
        latitude: -23.6095952632,
        longitude: -46.4637348745
    },

    {
        nome: "FLAVIO SILVA",
        endereco: "R. Dr. Faria Pereira, 114 - Lauzane Paulista",
        cidade: "São Paulo",
        telefone: "11988888888",
        latitude: -23.4894419630,
        longitude: -46.6374945899
    },

    {
        nome: "SERGIO SANTANA",
        endereco: "R. Hafiz Abi Chedid, 22 - Vila Bom Jardim",
        cidade: "São Paulo",
        telefone: "11977777777",
        latitude: -23.6847872510,
        longitude: -46.7570974611
    },

    {
        nome: "EVERTON SANTOS",
        endereco: "R. Assunção, 1268 - Chácaras Bandeirantes",
        cidade: "Jales",
        telefone: "11966666666",
        latitude: -20.2718812029,
        longitude: -50.5572660477
    },

    {
        nome: "MARCELO CAMPOS",
        endereco: "R. Cônego José Bento, 534 - Centro",
        cidade: "Jacareí",
        telefone: "11955555555",
        latitude: -23.3085505742,
        longitude: -45.9645797322
    },

    {
        nome: "MARCOS ROMERO",
        endereco: "R. Francisco Ruiz, 21 - Jequitibás",
        cidade: "São Manuel",
        telefone: "11944444444",
        latitude: -22.7282809738,
        longitude: -48.5644080476
    },

    {
        nome: "NILTON CRUZ",
        endereco: "Av. Belo Horizonte, 64 - Cidade Soberana",
        cidade: "Guarulhos",
        telefone: "11933333333",
        latitude: -23.4017467214,
        longitude: -46.4445318322
    },

    {
        nome: "NILTON FERRAZ",
        endereco: "R. Luiz Raimundino Dutra Filho, 95",
        cidade: "Sorocaba",
        telefone: "11922222222",
        latitude: -23.4239535198,
        longitude: -47.4092813034
    },

    {
        nome: "WILLIAN FONSECA",
        endereco: "Parque Residencial Vila União",
        cidade: "Campinas",
        telefone: "11911111111",
        latitude: -22.9448367951,
        longitude: -47.1231482806
    }

];



let mapa = null;

let rotaAtual = null;

let dadosRotaAtual = null;




async function calcularRota(
    latCliente,
    lonCliente,
    latTecnico,
    lonTecnico
) {


    const url =

    `https://router.project-osrm.org/route/v1/driving/${lonCliente},${latCliente};${lonTecnico},${latTecnico}?overview=false`;



    const resposta = await fetch(url);

    const dados = await resposta.json();



    if (!dados.routes || dados.routes.length === 0) {

        throw new Error("Rota não encontrada");

    }



    return {

        distancia:
        dados.routes[0].distance / 1000,

        tempo:
        dados.routes[0].duration / 60

    };

}





async function buscarLinhaRota(

    latCliente,
    lonCliente,
    latTecnico,
    lonTecnico

) {


    const url =

    `https://router.project-osrm.org/route/v1/driving/${lonCliente},${latCliente};${lonTecnico},${latTecnico}?overview=full&geometries=geojson`;



    const resposta = await fetch(url);

    const dados = await resposta.json();



    if (!dados.routes || dados.routes.length === 0) {

        throw new Error("Linha não encontrada");

    }



    return dados.routes[0]
        .geometry
        .coordinates
        .map(ponto => [

            ponto[1],
            ponto[0]

        ]);

}





function mostrarMapa(

    latCliente,
    lonCliente,
    tecnico,
    linhaRota

) {


    if (mapa) {

        mapa.remove();

    }



    mapa = L.map("mapa");



    L.tileLayer(

        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:
            "© OpenStreetMap"

        }

    ).addTo(mapa);




    const marcadorCliente =

    L.marker([

        latCliente,
        lonCliente

    ])

    .addTo(mapa)

    .bindPopup(
        "📍 Local do cliente"
    );




    const marcadorTecnico =

    L.marker([

        tecnico.latitude,
        tecnico.longitude

    ])

    .addTo(mapa)

    .bindPopup(

        "🔧 " + tecnico.nome +
        "<br>" +
        tecnico.telefone

    );





    rotaAtual =

    L.polyline(

        linhaRota,

        {

            color:"blue",

            weight:5

        }

    )

    .addTo(mapa);




    const grupo =

    L.featureGroup([

        marcadorCliente,
        marcadorTecnico

    ]);



    mapa.fitBounds(

        grupo.getBounds(),

        {

            padding:[40,40]

        }

    );



}






function abrirEscolhaRota() {


    if (!dadosRotaAtual) {

        return;

    }



    const escolha = confirm(

        "OK = Google Maps\nCancelar = Waze"

    );



    const origem =

    `${dadosRotaAtual.latCliente},${dadosRotaAtual.lonCliente}`;



    const destino =

    `${dadosRotaAtual.latTecnico},${dadosRotaAtual.lonTecnico}`;





    if (escolha) {


        window.open(

        `https://www.google.com/maps/dir/${origem}/${destino}`,

        "_blank"

        );


    } else {


        window.open(

        `https://waze.com/ul?ll=${destino}&navigate=yes`,

        "_blank"

        );


    }


}






function abrirWhatsapp() {


    if (!dadosRotaAtual) {

        return;

    }



    let numero =

    dadosRotaAtual.telefone
    .replace(/\D/g,'');




    window.open(

        `https://wa.me/55${numero}`,

        "_blank"

    );


}








async function localizarTecnico() {



    const endereco =

    document
    .getElementById("endereco")
    .value
    .trim();




    if (!endereco) {

        alert("Digite um endereço.");

        return;

    }





    try {



        const resposta = await fetch(

        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`

        );



        const dados = await resposta.json();



        if (dados.length === 0) {

            alert("Endereço não encontrado.");

            return;

        }





        const latCliente =

        parseFloat(dados[0].lat);



        const lonCliente =

        parseFloat(dados[0].lon);





        const lista = [];





        for (const tecnico of tecnicos) {


            try {


                const rota =

                await calcularRota(

                    latCliente,
                    lonCliente,
                    tecnico.latitude,
                    tecnico.longitude

                );



                lista.push({

                    ...tecnico,

                    distancia:
                    rota.distancia,

                    tempo:
                    rota.tempo

                });



            }

            catch(e){}



        }





        lista.sort(

            (a,b)=>

            a.distancia-b.distancia

        );





        const tecnico = lista[0];





        document.getElementById("nomeTecnico").innerText =
        tecnico.nome;



        document.getElementById("enderecoTecnico").innerText =
        tecnico.endereco;



        document.getElementById("cidadeTecnico").innerText =
        tecnico.cidade;



        document.getElementById("telefoneTecnico").innerText =
        tecnico.telefone;



        document.getElementById("distanciaTecnico").innerText =

        tecnico.distancia.toFixed(2)

        +" km - "

        +Math.round(tecnico.tempo)

        +" minutos";





        dadosRotaAtual = {

            latCliente,

            lonCliente,

            latTecnico: tecnico.latitude,

            lonTecnico: tecnico.longitude,

            telefone: tecnico.telefone

        };





        document.getElementById("btnRota").style.display =
        "block";



        document.getElementById("btnWhatsapp").style.display =
        "block";





        const linha =

        await buscarLinhaRota(

            latCliente,
            lonCliente,
            tecnico.latitude,
            tecnico.longitude

        );





        mostrarMapa(

            latCliente,
            lonCliente,
            tecnico,
            linha

        );





        const divLista =

        document.getElementById("listaTecnicos");



        divLista.innerHTML = "";





        lista.forEach((t,index)=>{


            divLista.innerHTML += `

            <div class="tecnico-card ${index===0 ? "mais-proximo":""}">

            <h3>

            ${index+1}º - ${t.nome}

            </h3>


            <p>${t.cidade}</p>

            <p>
            🚗 ${t.distancia.toFixed(2)} km
            </p>

            <p>
            ⏱ ${Math.round(t.tempo)} minutos
            </p>


            </div>

            `;


        });





    }

    catch(erro){

        console.error(erro);

        alert("Erro ao localizar endereço.");

    }


}








document.addEventListener(

"DOMContentLoaded",

()=>{


    document

    .getElementById("btnLocalizar")

    .addEventListener(

        "click",

        localizarTecnico

    );



    document

    .getElementById("btnRota")

    .addEventListener(

        "click",

        abrirEscolhaRota

    );



    document

    .getElementById("btnWhatsapp")

    .addEventListener(

        "click",

        abrirWhatsapp

    );


});