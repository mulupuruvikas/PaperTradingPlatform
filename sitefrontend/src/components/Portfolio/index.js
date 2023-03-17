import './index.scss';
import { useState } from 'react';

const Portfolio = () => {

    let tfgBody = "hello \n my name is vikas";
    let msftBody = "how are you";
    const [body, setBody] = useState(msftBody);

    const switchToMSFT = () => {
        setBody(msftBody);
    }
    const switchToTFG = () => {
        setBody(tfgBody);
    }

    return (
        <div className="container portfolio-page">
            <span className="tags top-tags"><b>Last login: Wed Feb 15 09:41:27 on console <br /> vikas@personal-website@where-i've-worked</b></span>
            <div className="text-zone">
                <div class="css-typing2">
                    <p>
                        experience:
                    </p>
                </div>
                <button class="button" onClick={switchToMSFT}>Microsoft</button>
                <button class="button2" onClick={switchToTFG}>Tech For Good</button>
                <div class="experience-body">
                    <p>{ body }</p>
                </div>
            </div>
        </div>
    );
}

export default Portfolio