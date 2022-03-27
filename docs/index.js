
async function main(){
    console.log(L,window.tree)

    const data = await fetch(
        "https://wolfiex.github.io/ONSAreaFinder/tree.json"
        ).then((d) => d.json())
        
        const tree = new rbush(10).fromJSON(data)


let map = L.map('leafletmap');

var b = tree.data;

map.fitBounds([
    [b.minY, b.minX],
    [b.maxY, b.maxX]
  ]);

  let osmLayer = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  ).addTo(map);

  /// Bounding Box
  var clicked = false
  let bbox = {
              minX: 0,
              minY: 0,
              maxX: 0,
              maxY: 0
          }

  map.on('click', function(e) {     

        var cloc= e.latlng;
        

        if (clicked){

          bbox.maxX = cloc.lng
          bbox.maxY = cloc.lat

          res = tree.search(bbox);

          console.log(res)

          res = res.reduce((acc, obj) => {
              const key = obj['origin'];
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(obj);
              return acc;
          }, {});

          console.table(res)
          console.log(res)


          var popup = L.popup()
            .setLatLng(cloc)
            .setContent(`<p>Hello world!<br />This is a nice popup. ${res}</p>`+ table(res))
            .openOn(map);    

        } else {

          bbox.minX = cloc.lng
          bbox.minY = cloc.lat

        }

        clicked =! clicked


            
    });



return 'leaf'
}

function table(data){
  console.log(data)
  string = ''

  Object.values(data).forEach(
    order => {
      string += `
      '<b> ${order} </b>`

      data[order].forEach(item => {
          string += `<tr>
                      <td>${item.year}</td>
                      <td>${item.id}</td>
                  </tr>`


      })
      
    }
  

  )

  return `
  <table class="styled-table">
    <tbody>
        ${string}
    </tbody>
</table>
  `
}


main().then(console.log)