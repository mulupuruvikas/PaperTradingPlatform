import { useLocation } from 'react-router-dom';

const Trade = () => {
    const location = useLocation();
    let symbol = location.state.symbol;

    return (
        <div className="container trade-page">
            <h1>{symbol},{symbol},{symbol},{symbol},{symbol},{symbol},{symbol},{symbol},{symbol},{symbol},{symbol},{symbol},</h1>
        </div>
    )
}

export default Trade