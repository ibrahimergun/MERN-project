import React, { useEffect } from 'react';
import axios from 'axios';

import './Map.css';

const Map = (props) => {
  const mapRef = React.useRef();
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  useEffect(() => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
          props.address,
        )}&key=${API_KEY}`,
      )
      .then((res) => {
        // res is the response from the server
        if (res.data.status !== 'OK') {
          throw new Error('No results found');
        }
        const location = res.data.results[0]?.geometry.location;

        const map = new window.google.maps.Map(mapRef.current, {
          center: location,
          //center: props.center, ---- null
          zoom: props.zoom,
        });

        new window.google.maps.Marker({
          position: location,
          // position: props.center,   ---- null
          map: map,
        });
      })
      .catch((err) => {
      });
  }, [API_KEY, props.address, props.center, props.zoom]);

  return (
    <div ref={mapRef} className={`map ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Map;
