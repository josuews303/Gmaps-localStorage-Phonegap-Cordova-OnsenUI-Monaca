/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var v = new Array();
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        

        console.log('Received Event: ' + id);
    }
};
var lat = '';
var lon = '';
var dest = '';
var directionsService;
var directionsDisplay;
function initMap() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: -0.1318858, lng: -78.4827243 }
    });
    directionsDisplay.setMap(map);

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    var myLatlng = { lat: parseFloat(lat.toString()), lng: parseFloat(lon) };
    // Create the initial InfoWindow.
    var infoWindow = new google.maps.InfoWindow(
        { content: 'Click the map to get routes', position: myLatlng });
    infoWindow.open(map);
    // Configure the click listener.
    map.addListener('click', function (mapsMouseEvent) {
        // Close the current InfoWindow.
        infoWindow.close();

        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({ position: mapsMouseEvent.latLng });
        infoWindow.setContent(mapsMouseEvent.latLng.toString());
        dest = mapsMouseEvent.latLng;
        infoWindow.open(map);
        onChangeHandler();
    });

    
}
var goC = function (n){
    var tmp = v[n];
    var lat1 = tmp.slice(1,tmp.indexOf(','));
    var long1 = tmp.slice(tmp.indexOf(',')+1,tmp.indexOf(')'));
    dest = {lat:parseFloat(lat1),lng:parseFloat(long1)};
    console.log('ndest',dest);
    calculateAndDisplayRoute(directionsService, directionsDisplay,1);
}
function calculateAndDisplayRoute(directionsService, directionsDisplay,lv) {
    var org = {lat:parseFloat(lat),lng:parseFloat(lon)};
    console.log('org',org);
    console.log('dest',dest);
    directionsService.route({
        origin: org,
        destination: dest,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            console.log('weaxD',dest.toString());
            if(lv==undefined){
                loadView(dest.toString());
            }
            
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
var onSuccess = function(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log('pos',position);
    console.log('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
function loadView(nc){
    v = localStorage.getItem('coord');
    console.log('v',v);
    var x = document.getElementById('listaU');
    x.innerHTML='';
    if(v==null){
        var y = document.createElement('div');
        y.innerHTML='<p style="padding:10px;">No hay coordenadas guardadas</p>';
        x.appendChild(y);
        if(nc!=undefined){
            v = new Array();
            v.push(nc);
            console.log('array',v);
            localStorage.setItem('coord',JSON.stringify(v));
            x.innerHTML='';
            var y = document.createElement("div");
                y.innerHTML='<li class="list-item list-item--tappable"><div onClick(0) class="list-item__center">'+nc.toString()+'</div></li>'
                x.appendChild(y);
        }
    }else{
        v = JSON.parse(v);
        console.log('parse',v);
        var x = document.getElementById('listaU');
            
            if(nc!=undefined){
                v.push(nc);
                localStorage.setItem('coord',JSON.stringify(v));
            }
            for (var i =0; i < v.length;i++){
                console.log(i);
                console.log(v[i]);
                var y = document.createElement("div");
                y.innerHTML='<li class="list-item list-item--tappable"><div onClick="goC('+i+')" class="list-item__center">'+v[i]+'</div></li>'
                x.appendChild(y);
            }
    }
    return v;
}
function clearStorage(){
    console.log('clear');
    localStorage.clear();
    loadView();
}
//localStorage.clear();
loadView();