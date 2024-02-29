import {StyleConstants} from "../../../service/style.constants";
import {Col, Container, Row} from "react-bootstrap";
import {Button} from "primereact/button";
import {FileUpload} from "primereact/fileupload";
import React, {useRef} from "react";

export const UpdateImageComponent = (
    {
        src,
        srcOnError = DEFAULT_IMAGE,
        alt = 'Imagem',
        onUploadPicture = () => {
        },
        onRemovePicture = () => {
        },
        customDefaultImage,
        isLoading=false
    }
) => {
    const fileUploadRef = useRef(null);
    return (
        <div style={{width: '100%', textAlign: 'center'}}>
            <Container>
                <Row>
                    <Col>
                        <img
                            style={StyleConstants.IMAGE_STYLE}
                            alt={alt}
                            src={src ? src : (customDefaultImage ? customDefaultImage : DEFAULT_IMAGE)}
                            onError={(e) => e.target.src = srcOnError}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={6} sm={12} style={{marginBottom: 15}}>
                        <Button
                            disabled={!src || isLoading}
                            style={StyleConstants.WIDTH_100_PERCENT}
                            label="Remover foto"
                            className="p-button-warning"
                            icon="pi pi-times"
                            onClick={() => onRemovePicture()}
                        />
                    </Col>
                    <Col md={6} sm={12} style={{marginBottom: 15}}>
                        <FileUpload
                            disabled={isLoading}
                            ref={fileUploadRef}
                            name="profilePicture"
                            accept="image/*"
                            customUpload={true}
                            uploadHandler={(x) => {
                                onUploadPicture(x.files[0]);
                                if (fileUploadRef.current) {
                                    fileUploadRef.current.clear();
                                }
                            }}
                            mode="basic"
                            auto={true}
                            chooseLabel="Selecionar foto"
                        />

                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const DEFAULT_IMAGE = '/images/band_default_icon.png';
