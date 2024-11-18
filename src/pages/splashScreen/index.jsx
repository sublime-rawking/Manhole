import React from "react";
import { Container, Row, Col } from "reactstrap";

const SplashScreen = () => {
    return (
        <Container fluid className="h-100">
            <Row className="h-100">
                <Col className="d-flex justify-content-center align-items-center">
                    <h1 className="display-1 my-auto text-primary">Manhole</h1>
                </Col>
            </Row>
        </Container>
    );
};

export default SplashScreen;
