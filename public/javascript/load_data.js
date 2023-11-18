import {tiempoArr, precipitacionArr, uvArr, temperaturaArr} from './static_data.js';
let fechaActual = () => new Date().toISOString().slice(0,10);
//let fechaActualISO = () => new Date().toISOString().slice(0,13) + ":00";

let cargarPrecipitacion = () => {

    //Obtenga la fecha actual
    let actual = fechaActual();

    //Defina un arreglo temporal vacío
    let datos = [];
    let datosUV = [];
    let datosTemp = [];


    //Itere en el arreglo tiempoArr para filtrar los valores de precipitacionArr que sean igual con la fecha actual
    for (let index = 0; index < tiempoArr.length; index++) {
        const tiempo = tiempoArr[index];
        const precipitacion = precipitacionArr[index]
        const uv = uvArr[index];
        const temperatura = temperaturaArr[index]


        if(tiempo.includes(actual)) {
          datos.push(precipitacion);
          datosUV.push(uv);
          datosTemp.push(temperatura);
        }

    }

    //Con los valores filtrados, obtenga los valores máximo, promedio y mínimo
    let max = Math.max(...datos)   ;
    let min = Math.min(...datos)   ;
    let sum = datos.reduce((a, b) => a + b, 0);
    let prom = (sum / datos.length) || 0;

    //Valores para la UV
    let maxUV = Math.max(...datosUV);
    let minUV = Math.min(...datosUV);
    let sumUV = datosUV.reduce((a, b) => a + b, 0);
    let promUV = (sumUV / datosUV.length) || 0; 

    //Valores para la temperatura
    let maxTemp = Math.max(...datosUV);
    let minTemp = Math.min(...datosUV);
    let sumTemp = datosUV.reduce((a, b) => a + b, 0);
    let promTemp = (sumUV / datosUV.length) || 0; 

    //Obtenga la referencia a los elementos HTML con id precipitacionMinValue, precipitacionPromValue y precipitacionMaxValue
    let precipitacionMinValue = document.getElementById("precipitacionMinValue")    ;
    let precipitacionPromValue = document.getElementById("precipitacionPromValue")  ;
    let precipitacionMaxValue = document.getElementById("precipitacionMaxValue")    ;

    //Valores para UV

    let uvMinValue = document.getElementById("uvMinValue");
    let uvPromValue = document.getElementById("uvPromValue");
    let uvMaxValue = document.getElementById("uvMaxValue");

    //Valores para temperatura

    let temperaturaMinValue = document.getElementById("temperaturaMinValue");
    let temperaturaMaxValue = document.getElementById("temperaturaMaxValue");
    let temperaturaPromValue = document.getElementById("temperaturaPromValue");


    //Actualice los elementos HTML con los valores correspondientes
    precipitacionMinValue.textContent = `Min ${min} mm`;
    precipitacionPromValue.textContent = `Prom ${ Math.round(prom * 100) / 100 } mm`   ;
    precipitacionMaxValue.textContent = `Max ${max} mm`;

    //Valores para UV 
    uvMinValue.textContent = `Min ${minUV} UV `; 
    uvPromValue.textContent = `Prom ${Math.round(promUV * 100) / 100} UV`;
    uvMaxValue.textContent = `Max ${maxUV} UV`;

    //Valores para UV 
    temperaturaMinValue.textContent = `Min ${minUV} °C `; 
    temperaturaPromValue.textContent = `Prom ${Math.round(promUV * 100) / 100} °C`;
    temperaturaMaxValue.textContent = `Max ${maxUV} °C`;


}


let cargarFechaActual = () => {

    //Obtenga la referencia al elemento h6
    let coleccionHTML = document.getElementsByTagName("h6")

    let tituloH6 = coleccionHTML[0]

    //Actualice la referencia al elemento h6 con el valor de la función fechaActual()
    tituloH6.textContent = fechaActual()

}


let cargarOpenMeteo = () => {

    //URL que responde con la respuesta a cargar
    let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m&timezone=auto'; 
  
    fetch( URL )
    .then(responseText => responseText.json())
    .then(responseJSON => {
      
    //Respuesta en formato JSON

    //Referencia al elemento con el identificador plot
    let plotRef = document.getElementById('plot1');

    //Etiquetas del gráfico
    let labels = responseJSON.hourly.time;

    //Etiquetas de los datos
    let data = responseJSON.hourly.temperature_2m;

    //Objeto de configuración del gráfico
    let config = {
      type: 'line',
      data: {
        labels: labels, 
        datasets: [
          {
            label: 'Temperature [2m]',
            data: data, 
          }
        ]
      }
    };

    //Objeto con la instanciación del gráfico
    let chart1  = new Chart(plotRef, config);

  })
    .catch(console.error); 
  }


  let cargarOpenMeteo2 = () => {

    //URL que responde con la respuesta a cargar
    let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=dewpoint_2m,precipitation_probability&timezone=auto'; 
  
    fetch( URL )
    .then(responseText => responseText.json())
    .then(responseJSON => {
      
    //Respuesta en formato JSON

    //Referencia al elemento con el identificador plot
    let plotRef = document.getElementById('plot2');

    //Etiquetas del gráfico
    let labels = responseJSON.hourly.time;

    //Etiquetas de los datos
    let data = responseJSON.hourly.precipitation_probability;
    let data2 = responseJSON.hourly.dewpoint_2m;

    //Objeto de configuración del gráfico
    let config = {
        type: 'line',
        data: {
          labels: labels, 
          datasets: [
            {
              label: 'Precipitation Probability',
              data: data, 
            },
            {
                label: 'dewpoint [2m]',
                data: data2,
            }
          ]
        }
      };

    //Objeto con la instanciación del gráfico
    let chart2  = new Chart(plotRef, config);

  })
    .catch(console.error); 
  }






  let parseXML = (responseText) => {
  
    const parser = new DOMParser();
    const xml = parser.parseFromString(responseText, "application/xml");


    // Referencia al elemento `#forecastbody` del documento HTML

    let forecastElement = document.querySelector("#forecastbody")
    forecastElement.innerHTML = ''

    // Procesamiento de los elementos con etiqueta `<time>` del objeto xml
    let timeArr = xml.querySelectorAll("time")

    timeArr.forEach(time => {
        
        let from = time.getAttribute("from").replace("T", " ")

        let humidity = time.querySelector("humidity").getAttribute("value")
        let windSpeed = time.querySelector("windSpeed").getAttribute("mps")
        let precipitation = time.querySelector("precipitation").getAttribute("probability")
        let pressure = time.querySelector("pressure").getAttribute("value")
        let cloud = time.querySelector("clouds").getAttribute("value")

        let template = `
            <tr>
                <td>${from}</td>
                <td>${humidity}</td>
                <td>${windSpeed}</td>
                <td>${precipitation}</td>
                <td>${pressure}</td>
                <td>${cloud}</td>
            </tr>
        `

        //Renderizando la plantilla en el elemento HTML
        forecastElement.innerHTML += template;
    })

  
  }







  
  //Callback
  let selectListener = async (event) => {
  
    let selectedCity = event.target.value
    let cityStorage = localStorage.getItem(selectedCity);
    
    if(cityStorage == null){
      try {

        //API key
        let APIkey = '544642d69e67e6a5295680c3b7ffb831'
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${APIkey}`

        let response = await fetch(url)
        let responseText = await response.text()
        
        await parseXML(responseText)
  
      } catch (error) {
        console.log(error)
      }
    
    }else{
      parseXML(cityStorage)
    }
    
    
   }
  






  let loadForecastByCity = () => {
  
    //Handling event
 
    let selectElement = document.querySelector("select")
    selectElement.addEventListener("change", selectListener)
  
  }
  


  var lastScrollTop = 0;
  window.addEventListener("scroll", function() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
          document.querySelector('.navbar').classList.add('hide');
      } else {
          document.querySelector('.navbar').classList.remove('hide');
      }
      lastScrollTop = scrollTop;
  });


  loadForecastByCity()
  cargarPrecipitacion()
  cargarFechaActual()
  cargarOpenMeteo()
  cargarOpenMeteo2()
  selectListener()
  parseXML()
  

 


