import React from "react";
import mapboxgl from "mapbox-gl";
import chargerIconRegular from "./assets/level2_operational_icon.png";
import chargerIconTesla from "./assets/level3_operational_icon.png";
import chargerIconPrivate from "./assets//level2_private_icon.png";
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
          accessToken:process.env.REACT_API_KEY_MAPBOX,,
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

              if (location.Connections[0].ConnectionTypeID === 30) {
                el.style.backgroundImage = "url(" + chargerIconPrivate + ")";
              } else if (location.Connections[0].ConnectionTypeID === 1) {
                el.style.backgroundImage = "url(" + chargerIconRegular + ")";
              } else {
                el.style.backgroundImage = "url(" + chargerIconTesla + ")";
              }

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
                      location.Connections[0].ConnectionType.Title +
                      `<br>` +
                      location.AddressInfo.Title +
                      `</div></h6>
                    <div class="card-body">
                      <h6 style="font-weight: bold;" >Location Details</h6>
                      <p class="card-text row"><span class="col-sm-6 mt-3">` +
                      location.AddressInfo.AddressLine1 +
                      `<br>` +
                      location.AddressInfo.Town +
                      `<br>` +
                      location.AddressInfo.Country.Title +
                      `<br>` +
                      location.AddressInfo.StateOrProvince +
                      `<br>` +
                      location.AddressInfo.Postcode +
                      `</span><span class="col-sm-6">` +
                      location.AddressInfo.AccessComments +
                      `<br>` +
                      location.AddressInfo.ContactTelephone1 +
                      `<br><a href="` +
                      location.AddressInfo.RelatedURL +
                      `">location.AddressInfo.RelatedURL</a>` +
                      `
                      </span></p>
                      <hr>
                      <div>
                      <h6 style="font-weight: bold;">Equipment Details</h6>
                      <div class="row">
                      <div class="col-sm-12">
                      <span>Usage Cost:` +
                      location.UsageCost +
                      `</span>
                      </div>
                      </div>
                      </div>
                      <hr>
                      <div>
                      <h6 style="font-weight: bold;"> Additional Information
                      Data Provide</h6>
                      <div class="row">
                      <div class="col-sm-12">
                      <span>Usage Cost:` +
                      location.DataProvider.Title +
                      `<br><a href="` +
                      location.DataProvider.WebsiteURL +
                      `">location.AddressInfo.RelatedURL</a>` +
                      `</span>
                      </div>
                      </div>
                      </div>
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
