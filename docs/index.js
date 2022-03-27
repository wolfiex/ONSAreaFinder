
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
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>  &copy; <a href="https://carto.com/attributions">CARTO</a> &copy ONS &copy; DanEllis    <br/>  -- <br> <div id="credit"/> <b> <i>Instructions: Click to start selecting an area bounding box</i> ..</b>'
    }
  ).addTo(map);


  var bounds = [[0,0], [0,0]];     
  var rect = L.rectangle(bounds).addTo(map);
  console.warn('rrrr',rect)

  /// Bounding Box
  var clicked = false
  var selected = false
  let bbox = {x:[],y:[]}

  let credits = document.getElementById('credits')


  map.on('mousemove', function (m){
    if (clicked){
      rect.setBounds([[bbox.y[0],bbox.x[0]],m.latlng])

    }




  })



  map.on('click', function(e) {     

        var cloc= e.latlng;
        

        if (clicked){

          bbox.x.push(cloc.lng)
          bbox.y.push(cloc.lat)

          let box = {
            'minX':Math.min(...bbox.x),
            'maxX':Math.max(...bbox.x),
            'minY':Math.min(...bbox.y),
            'maxY':Math.max(...bbox.y),
          }

          rect.setBounds([[box.minY,box.minX],[box.maxY,box.maxX]])

          console.error(box,bbox)
          






          flat = tree.search(box);
          console.log(flat)

          res = groupby(flat,'origin')
          download(res,box)

          console.table(res)
          console.log(res)


          var popup = L.popup()
            .setLatLng( L.latLng(box.maxY,(box.maxX+box.minX)/2))
            .setContent(`<h4>Areas Found: ${flat.length}</h4> Columns are Year | areas | length 
            <br />`+ table(res))
            .openOn(map);    

        } else {
          
          bbox = {x:[],y:[]}
          bbox.x.push(cloc.lng)
          bbox.y.push(cloc.lat)
          credit.innerHTML=''

        }

        clicked =! clicked


            
    });



return 'leaf'
}

function table(data){
  string = ''

  Object.keys(data).forEach(
    order => {
      cstr =''
      string += `
      <b> ${order} </b>`

      g = groupby(data[order],'year')
      
      Object.keys(g).forEach(item => {

        year = g[item]

          string+=`<p class='item'> <i> ${item} </i>:   <input type="text" id="${item}" name="${item}" value="${year.map(w=>w['id']).join(',')}" readonly> (${year.length})
           </p> `

      })

      // credit.innerHTML = cstr
      
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

function download(results,box){

      var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({bounds:box,areas:results}));
      // el.setAttribute("href", "data:"+data);
      // el.setAttribute("download", "data.json");   

      credit.innerHTML = `<a href=data:${data} download='areafinder.json'> Download Selection </a> `


}

function groupby(arr,prop){
  return arr.reduce((acc, obj) => {
              const key = obj[prop];
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(obj);
              return acc;
          }, {});
}

main().then(console.log)