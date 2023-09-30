import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import HomeTemplate from "../../../template/home_template";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {MarginStyle} from "../../../../../style/margin.style";

export const SearchBandsPage = ({token, updateToken, user}) => {
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
            <_SearchBandsPage showToast={showToast} redirectTo={redirectTo}/>
        </>
    )
}

export default class _SearchBandsPage extends React.Component {
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
            <HomeTemplate steps={['Serviços']}>
                <Card title="Bandas" style={MarginStyle.makeMargin(0, 10, 0,10)}>
                    <p className="m-0">
                        Não importa o estilo musical que você busca ou o tamanho do seu evento, estamos comprometidos
                        em conectar você aos grupos musicais mais talentosos da região. Deixe-nos fazer parte da trilha
                        sonora do seu evento, tornando-o verdadeiramente memorável.
                    </p>
                    <Button
                        icon=" pi pi-search"
                        style={MarginStyle.makeMargin(0, 10, 0,0)}
                        label="Buscar"
                        onClick={() => redirectTo("/servicos/bandas")}
                    />
                </Card>
                <Card title="Buffet" style={MarginStyle.makeMargin(0, 10, 0,10)}>
                    <p className="m-0">
                        Não importa o tamanho ou estilo do seu evento, estamos comprometidos em conectar você aos
                        buffets mais talentosos da região. Deixe-nos fazer parte da experiência gastronômica do seu
                        evento, tornando-o verdadeiramente memorável.
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
