const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 15);

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "meet",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  console.log(data);
  map.setView([latitude, longitude]);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (data) => {
  const { id } = data;
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
    console.log("Marker deleted:", id);
  }
});
