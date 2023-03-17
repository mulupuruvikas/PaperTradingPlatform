import {
    faPython,
    faCss3,
    faGithub,
    faHtml5,
    faJava,
    faReact,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.scss'

const About = () => {

    return (
        <div className="container about-page">
            <span className='tags top-tags'>
                <b>Last login: Wed Feb 15 09:41:27 on console <br /> vikas@personal-website@about-me</b>
            </span>
            <div className="text-zone">
                <div class="css-typing">
                    <p>
                        <b>about me</b>
                    </p>
                </div>
            </div>
            <div className="page-content">
                <p>
                    Paragraph 1
                </p>
                <p align="LEFT">
                    Paragraph 2               
                </p>
                <p>
                    Paragraph 3
                </p>
            </div>

            <div className="stage-cube-cont">
                <div className="cubespinner">
                    <div className="face1">
                        <FontAwesomeIcon icon={faPython} color="#DD0031" />
                    </div>
                    <div className="face2">
                        <FontAwesomeIcon icon={faHtml5} color="#F06529" />
                    </div>
                    <div className="face3">
                        <FontAwesomeIcon icon={faCss3} color="#28A4D9" />
                    </div>
                    <div className="face4">
                        <FontAwesomeIcon icon={faReact} color="#5ED4F4" />
                    </div>
                    <div className="face5">
                        <FontAwesomeIcon icon={faJava} color="#EFD81D" />
                    </div>
                    <div className="face6">
                        <FontAwesomeIcon icon={faGithub} color="#EC4D28" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About