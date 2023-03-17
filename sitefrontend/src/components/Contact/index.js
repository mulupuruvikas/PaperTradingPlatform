import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faDiscord, faInstagram, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import React, { Component } from 'react';
import 'leaflet/dist/leaflet.css'

const Contact = () => {
    return (
        <>
            <div className='container contact-page'>
                <span className='tags top-tags'><b>Last login: Wed Feb 15 09:41:27 on console <br /> vikas@personal-website@contact-me</b></span>
                <div className='text-zone'>
                    <div class="css-typing">
                        <p>
                            <b>contact me</b>
                        </p>
                    </div>
                    <p>
                        Little subtitle goes here.
                    </p>
                </div>
                <div className='single-col socials-icons d-flex justify-content-evenly'>
                    <a className='social-icons' href='https://www.linkedin.com/in/vikas-mulupuru-01418a1a5/'>
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a className='social-icons' href='https://discord.com/users/vikas#6382'>
                        <FontAwesomeIcon icon={faDiscord} />
                    </a>
                    <a className='social-icons' href='https://twitter.com/MulupuruVikas'>
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a className='social-icons' href='https://www.instagram.com/vikasmulupuru/'>
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href='https://github.com/mulupuruvikas'>
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                    <a href='https://www.linkedin.com/in/vikas-mulupuru-01418a1a5/'>
                        <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                </div>
                <div className="info-map">
                    Vikas Mulupuru,
                    <br />
                    United States,
                    <br />
                    UMN Twin Cities, Minneapolis<br />
                    Minnesota <br />
                    <br />
                </div>
                <div className="map-wrap">
                    <MapContainer center={[44.97047721170162, -93.22762002854225]} zoom={16}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[44.97047721170162, -93.22762002854225]}>
                            <Popup>Vikas is here, say hello :)</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </>
    )
}

export default Contact