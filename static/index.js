const socket = io('http://localhost:5000', { withCredentials: true });
const imageUrl = "{{ url_for('static', filename='img/markers/mm_20_purple.png') }}";
const locations = [];
const return_locations = [];
var return_drone_num;
let markers = [];
var home = {lat : 37.39190049401572, lng : 126.63967953361517};
var point = {lat : 37.39190049401572, lng : 126.63967953361517};
markers.push([37.39190049401572, 126.63967953361517, 10]);
let map;
async function initMap() {
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: home.lat, lng: home.lng },
    zoom: 13,
  });

  map.data.addGeoJson(data);
map.data.setStyle(function (feature) {
  var color = feature.getProperty('fillColor');
  return {
      fillColor: color,
      strokeWeight: 0.5
  };
});
  var infowindow = new google.maps.InfoWindow();

  var marker, i;

  var marker = new google.maps.Marker({position: home, map: map});
  var marker = new google.maps.Marker({position: home, map: map});

      google.maps.event.addListener(map, 'click', function(event) {
        endlat = event.latLng.lat();
        endlng = event.latLng.lng();
        
        document.getElementById("lat").value = endlat;
        document.getElementById("lng").value = endlng;

        marker.setPosition(event.latLng);
        console.log('point')
        console.log(point.lat,point.lng)
        var x = (Math.cos(point.lat) * 6400 * 2 * Math.PI/360) * Math.abs(point.lat-endlat);
        var y = 111 * Math.abs(point.lng - endlng);
        var distance = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        var pointnum = Math.ceil((distance * 1000) / 499);
        var pointlat = (point.lat - endlat)/pointnum
        var pointlng = (point.lng - endlng)/pointnum      

        // console.log('lat는 ' + x + ' 입니다.')
        // console.log('lng는 ' + y + ' 입니다.')
        // console.log('result는 ' + distance + ' 입니다.')
        // console.log('point갯수는 ' + pointnum + '개 입니다.')
        // console.log(pointlat)
        // console.log(pointlng)
        var a = point.lat;
        var b = point.lng;
        locations.length = 0;
        
          for(i=0; i < pointnum; i++){
            a -= pointlat
            b -= pointlng
            locations.push([a,b]);
          }
      });
      var infowindow = new google.maps.InfoWindow();
      document
/*     .getElementById("delete-markers")
    .addEventListener("click", deleteMarkers); */
  // Adds a marker at the center of the map


}

initMap();

function plan1() {
  var marker, i;
  for (i = 0; i < locations.length; i++) {
    
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][0], locations[i][1]),
      map: map,
      title : "drone"
    });
    if(i == locations.length - 1){
      point = {lat : locations[i][0], lng : locations[i][1]};
      document.getElementById("point_lat").value = locations[i][0];
      document.getElementById("point_lng").value = locations[i][1];
    }
    markers.push([locations[i][0], locations[i][1], 10]);
  }
}
function return_drone() {
  return_home();
  var return_marker, i;
  console.log('return')
  console.log(return_locations)
  for (i = return_locations.length; i >= 1; i--) {
    return_marker = new google.maps.Marker({
      position: new google.maps.LatLng(return_locations[i-1][0], return_locations[i-1][1]),
      map: map,
      title : "drone"
    });
    markers.push([return_locations[i-1][0], return_locations[i-1][1], 10]);
  }
  markers.push([37.39190049401572, 126.63967953361517, 10]);
  return_drone_num = 1
}
function point_list() {
  console.log(markers)
  if(markers.length == 1){
  alert("미션 설정을 하지 않아 업로드가 불가능합니다.")
  }
  else if(return_drone_num != 1){
    alert("미션 복귀를 하지 않아 업로드가 불가능합니다.")
    }
  else{
    var alti = document.getElementById('Alti');
    socket.emit('plan1', { markers });
    alert("미션 플랜 완료! 비행미션 갯수는" +markers.length+"개 \n"+"고도는"+alti.value+"M 입니다.\n"+"안전한 비행 하세요!")
    }
}
// 고도 설정 함수
function Altitude() {
  var alti = document.getElementById('Alti');
  
  if(alti != null){
    console.log("설정 고도는 "+alti.value+"m 입니다.")
    alert("설정 고도는 "+alti.value+"m 입니다.")
  }
}
// 모든 마커를 지우는 함수
function deleteMarkers() {
  location.reload();
}

function toggleDiv() {
  var div = document.getElementById("content");
  if (div.style.display === "" || div.style.display === "none") {
     div.style.display = "block";
  } else {
     div.style.display = "none";
  }
}
$("li").click(function () {
  if ($(this).hasClass("active")) {
    $(this).children().css("display", "none");
    $(this).removeClass();
  } else {
    $(this).addClass("active");
    $(this).children().css("display", "block");
  }
});

var droneMarker = null;  // 이전 마커를 추적하기 위한 변수

socket.on('drone_position', function(data) {
  // 서버로부터 받은 드론의 위치 정보 처리
  console.log('Received drone position:', data.latitude, data.longitude);

  // 이전 마커가 있다면 제거
  if (droneMarker !== null) {
    droneMarker.setMap(null);
  }

  // 새로운 위치에 마커 추가
  droneMarker = new google.maps.Marker({
    position: new google.maps.LatLng(data.latitude, data.longitude),
    map: map,
    title: "Drone"
  });

  // 여기서 원하는 동작을 수행할 수 있습니다.
});