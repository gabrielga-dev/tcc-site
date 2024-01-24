import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import HomeTemplate from "../../template/home_template";
import {Col, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../service/style.constants";
import {Accordion, AccordionTab} from "primereact/accordion";

export const SelectPersonRolePage = () => {
    const toast = useRef(null);
    const showToast = (body) => {
        toast.current.show(body);
    };

    const navigate = useNavigate();
    const redirectTo = (route) => {
        navigate(route);
    };
    return (
        <_SelectPersonRolePage
            navigateTo={redirectTo}
            showToast={showToast}
        />
    );
}

class _SelectPersonRolePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            navigateTo: props.navigateTo,
            showToast: props.showToast,
        }
    }

    render() {
        return (
            <HomeTemplate steps={['Cadastrar', 'Tipos']}>
                <Accordion activeIndex={0}>
                    <AccordionTab header="Mais Comuns">
                        <Row>
                            <Col>
                                <Card
                                    style={CARD_STYLE}
                                    title="Quero contratar bandas para meus eventos!"
                                    footer={this.registrationButton('contratante')}
                                >
                                    <p>
                                        Você gostaria de organizar sua festa de aniversário ou até eventos gloriósos, os
                                        quais todos vão ficar sabendo e se roendo para poder conseguir um ingresso? E o
                                        melhor: podendo conferir e contratar uma vasta gama de serviços disponibilizados
                                        na nossa plataforma? Então clique no botão abaixo e dê o passo que fará seus
                                        eventos serem grandiosos e inesquecíveis de uma forma invrívelmente fácil!
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                    </AccordionTab>
                    <AccordionTab header="Música">
                        <Row>
                            <Col>
                                <Card
                                    style={CARD_STYLE}
                                    title="Quero gerenciar bandas!"
                                    footer={this.registrationButton('banda')}
                                >
                                    <p>
                                        Se você possui uma banda (ou várias!) e quer que as pessoas consigam chegar
                                        até
                                        você de forma prática e fácil e conhecer seu trabalho e, ainda por cima,
                                        poder
                                        chamar você para tocar em eventos inesquecíveis, clique no botão abaixo e
                                        paroveite
                                        tudo o que a plataforma disponibiliza para você e sua banda!
                                    </p>
                                </Card>
                            </Col>
                            <Col>
                                <Card
                                    style={CARD_STYLE}
                                    title="Busco ser contratado por bandas!"
                                    footer={this.registrationButton('musico')}
                                >
                                    <p>
                                        Você deseja mostrar para o munso como você canta, toca e consegue encantar
                                        até a platéia mais exigente? Então clique no botão abaixo e seja
                                        encontradx pelas mais renomadas bandas de seu nicho e aumente cada vez mais
                                        o seu repertório e seu histórico de apresentações épicas!
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                    </AccordionTab>
                </Accordion>
            </HomeTemplate>
        )
    }

    registrationButton(type) {
        let {navigateTo} = this.state;
        return (
            <Button
                style={CARD_BUTTON_STYLE}
                label="Este aqui!"
                onClick={() => navigateTo(`/cadastro/${type}`)}
            />
        );
    }
}

const CARD_BUTTON_STYLE = Object.assign(
    {},
    StyleConstants.WIDTH_100_PERCENT,
    StyleConstants.FONT_BIG,
    StyleConstants.FONT_BOLD
);

const CARD_STYLE = {border: '2px solid #333'};
