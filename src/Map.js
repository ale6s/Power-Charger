import React from "react";
import mapboxgl from "mapbox-gl";
import chargerIcon from "./assets/icons8-car-charger-48.png";
import "bootstrap/dist/css/bootstrap.min.css";
require("dotenv").config();

class Mapp extends React.Component {
  // Set up states for updating map
  constructor(props) {
    super(props);
    this.state = {
      zoom: 12,
    };
  }

  // Create map and lay over markers
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const map = new mapboxgl.Map({
          accessToken:
            "pk.eyJ1Ijoia2lyaXRveDEyMyIsImEiOiJjazdqdHg0bjcwendqM2xxazN2d3A2Z2w1In0.KAPj1fSodUGpUtvgvy3yOA ",
          container: this.mapContainer,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [position.coords.longitude, position.coords.latitude],
          zoom: this.state.zoom,
        });
        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
        map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          "bottom-right"
        );

        //calling poins into map
        fetch(
          "https://api.openchargemap.io/v3/poi?latitude=" +
            position.coords.latitude +
            "&longitude=" +
            position.coords.longitude +
            "&distance=100&key=" +
            process.env.REACT_API_KEY_CHARGER
        )
          .then((res) => res.json())
          .then((data) => {
            data.forEach((location) => {
              //console.log(location.AddressInfo);
              var el = document.createElement("div");
              el.className = "marker";
              el.style.backgroundImage = "url(" + chargerIcon + ")";

              new mapboxgl.Marker(el)
                .setLngLat([
                  location.AddressInfo.Longitude,
                  location.AddressInfo.Latitude,
                ])
                .setPopup(
                  new mapboxgl.Popup({ offset: 30 }).setHTML(
                    `<div class="card">
                    <h6 class="card-header text-primary">` +
                      location.AddressInfo.Title +
                      `<div class="text-secondary">OCM-` +
                      location.ID +
                      `<br>` +
                      `</div></h6>
                    <div class="card-body">
                      <h5 class="card-title">Special title treatment</h5>
                      <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                      <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                  </div>`
                  )
                )
                .addTo(map);
            });
          });
      });
    }
  }

  render() {
    return (
      <div>
        <div
          ref={(el) => (this.mapContainer = el)}
          style={{ width: "100%", height: "100vh" }}
        />
      </div>
    );
  }
}

export default Mapp;
