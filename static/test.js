
function return_home() {

return_lat = point.lat;
return_lng = point.lng;

var return_x = (Math.cos(home.lat) * 6400 * 2 * Math.PI/360) * Math.abs(home.lat-return_lat);
        var return_y = 111 * Math.abs(home.lng - return_lng);
        var return_distance = Math.sqrt(Math.pow(return_x,2) + Math.pow(return_y,2));
        var return_pointnum = Math.ceil((return_distance * 1000) / 499);
        var return_lat = (home.lat - return_lat)/return_pointnum
        var return_lng = (home.lng - return_lng)/return_pointnum      

        // console.log('lat는 ' + x + ' 입니다.')
        // console.log('lng는 ' + y + ' 입니다.')
        // console.log('result는 ' + distance + ' 입니다.')
        // console.log('point갯수는 ' + pointnum + '개 입니다.')
        // console.log(return_pointlat)
        // console.log(return_pointlng)
        var return_a = home.lat;
        var return_b = home.lng;
        return_locations.length = 0;

          for(i=0; i < return_pointnum; i++){
            return_a -= return_lat
            return_b -= return_lng
            return_locations.push([return_a,return_b]);
          }

}
function return_home1() {

  return_lat = point.lat;
  return_lng = point.lng;
  
  var return_x = (Math.cos(return_lat) * 6400 * 2 * Math.PI/360) * Math.abs(return_lat-home.lat);
          var return_y = 111 * Math.abs(return_lng - home.lng);
          var return_distance = Math.sqrt(Math.pow(return_x,2) + Math.pow(return_y,2));
          var return_pointnum = Math.ceil((return_distance * 1000) / 499);
          var return_lat = (return_lat - home.lat)/return_pointnum
          var return_lng = (return_lng - home.lng)/return_pointnum      
  
          // console.log('lat는 ' + x + ' 입니다.')
          // console.log('lng는 ' + y + ' 입니다.')
          // console.log('result는 ' + distance + ' 입니다.')
          // console.log('point갯수는 ' + pointnum + '개 입니다.')
          // console.log(return_pointlat)
          // console.log(return_pointlng)
          var return_a = return_lat;
          var return_b = return_lng;
          return_locations.length = 0;
  
            for(i=0; i < return_pointnum; i++){
              return_a -= return_lat
              return_b -= return_lng
              return_locations.push([return_a,return_b]);
            }
  
  }



