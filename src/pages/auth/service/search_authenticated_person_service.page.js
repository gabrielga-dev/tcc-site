import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import HomeTemplate from "../../template/home_template";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {MarginStyle} from "../../../style/margin.style";

export const SearchAuthenticatedServices = () => {
    const toast = useRef(null);
    const navigate = useNavigate();

    const redirectTo = (to) => {
        navigate(to);
    };
    const showToast = (body) => {
        toast.current.show(body);
    };
    return (
        <>
            <_SearchAuthenticatedServices showToast={showToast} redirectTo={redirectTo}/>
        </>
    )
}

export default class _SearchAuthenticatedServices extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: props.showToast,
            redirectTo: props.redirectTo
        }
    }

    render() {
        let {redirectTo} = this.props
        return (
            <HomeTemplate steps={['Meus Serviços']}>
                <Card title="Minhas Bandas" style={MarginStyle.makeMargin(0, 10, 0,10)}>
                    <p className="m-0">
                        Veja todas as bandas que estão sob a sua ordem!
                    </p>
                    <Button
                        icon=" pi pi-search"
                        style={MarginStyle.makeMargin(0, 10, 0,0)}
                        label="Buscar"
                        onClick={() => redirectTo("/meus-servicos/banda")}
                    />
                </Card>
                <Card title="Meus Buffets" style={MarginStyle.makeMargin(0, 10, 0,10)}>
                    <p className="m-0">
                        Veja todas os buffets que estão sob a sua ordem!
                    </p>
                    <Button
                        icon="pi pi-search"
                        style={MarginStyle.makeMargin(0, 10, 0,0)}
                        label="Buscar"
                    />
                </Card>
            </HomeTemplate>
        )
    }
}
