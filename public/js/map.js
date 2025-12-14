mapboxgl.accessToken = mapToken;

// Make sure listing + geometry exist
if (!listing || !listing.geometry || !listing.geometry.coordinates) {
    console.error("❌ No coordinates found for this listing");
} else {
    const coordinates = listing.geometry.coordinates; // <-- FIXED

    console.log("Map Coordinates:", coordinates);

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates,      // <-- Lng, Lat from MongoDB
        zoom: 10,
    });

    map.addControl(new mapboxgl.NavigationControl());

    new mapboxgl.Marker({ color: "red" })
        .setLngLat(coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${listing.title}</h4><p>${listing.location}</p>`)
        )
        .addTo(map);
}
