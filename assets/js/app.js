/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import '../styles/app.css';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Items from './Components/Items';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entries: []
        };
    }

    componentDidMount() {
        //dodac header do zapytania
        axios.get('/api/dreams')
            .then(response => {
                // Dostęp do danych w hydra:member
                const hydraMember = response.data['hydra:member'];
                this.setState({ entries: hydraMember });
                console.log('Dane pobrane z API (hydra:member):', hydraMember);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    }

    render() {
        const { entries } = this.state;
        return (
            <div className="row">
                {entries.length > 0 ? (
                    entries.map(({ id, title, body }) => (
                        <Items
                            key={id}
                            title={title}
                            body={body}
                        />
                    ))
                ) : (
                    <p>No data available</p>
                )}
            </div>
        );
    }
}
import { createRoot } from 'react-dom/client';
import response from "core-js/internals/is-forced";
createRoot(document.getElementById('root')).render(<App />);
/*createRoot(<App />, document.getElementById('root'));*/

