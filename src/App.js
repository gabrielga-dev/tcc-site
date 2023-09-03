import {Outlet, useNavigate} from "react-router-dom";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

import 'primeicons/primeicons.css';


//core
import "primereact/resources/primereact.min.css";
import {PrimeReactProvider} from "primereact/api";

import {MegaMenu} from 'primereact/megamenu';
import React from "react";



function App() {
    const navigate = useNavigate();
    return (
        <PrimeReactProvider>
            <div className="card">
                <MegaMenu
                    model={items(navigate)}
                    orientation="horizontal"
                    breakpoint="767px"
                />
                <Outlet/>
            </div>
        </PrimeReactProvider>
    );
}

const items = (navigate) => (
    [
        {
            label: 'Serviços', icon: 'pi pi-fw pi-briefcase',
            items: [
                [
                    {
                        label: 'B',
                        items: [
                            {
                                label: 'Bandas para eventos',
                                command: () => navigate("/bands")
                            },
                            {
                                label: 'Buffets',
                                command: () => navigate("/buffets")
                            },
                        ]
                    },
                ]
            ]
        }
    ]
);

export default App;
